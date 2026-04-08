-- Security hardening and integrity improvements

-- Ensure only one in-progress attempt exists per user/exam.
CREATE UNIQUE INDEX IF NOT EXISTS exam_attempts_one_active_per_user_exam
ON public.exam_attempts (user_id, exam_id)
WHERE status = 'in_progress';

-- Students should not read the answer key directly from questions.
DROP POLICY IF EXISTS "Authenticated can view questions of active exams" ON public.questions;
CREATE POLICY "Admins can view all questions" ON public.questions
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Constrain attempt creation to active exams only.
DROP POLICY IF EXISTS "Users can create own attempts" ON public.exam_attempts;
CREATE POLICY "Users can create own attempts" ON public.exam_attempts
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1
    FROM public.exams e
    WHERE e.id = exam_id
      AND e.is_active = true
  )
);

-- Students cannot directly finalize an attempt from client updates.
DROP POLICY IF EXISTS "Users can update own in-progress attempts" ON public.exam_attempts;
CREATE POLICY "Users can update own in-progress attempts" ON public.exam_attempts
FOR UPDATE TO authenticated
USING (auth.uid() = user_id AND status = 'in_progress')
WITH CHECK (
  auth.uid() = user_id
  AND status = 'in_progress'
  AND submitted_at IS NULL
  AND total_score IS NULL
  AND total_correct = 0
  AND total_wrong = 0
  AND total_unanswered = 0
);

-- Start a new attempt or resume an existing in-progress one atomically.
CREATE OR REPLACE FUNCTION public.start_or_resume_attempt(_exam_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID := auth.uid();
  _attempt_id UUID;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.exams e WHERE e.id = _exam_id AND e.is_active = true
  ) THEN
    RAISE EXCEPTION 'Exam is not active';
  END IF;

  SELECT id
  INTO _attempt_id
  FROM public.exam_attempts
  WHERE user_id = _user_id
    AND exam_id = _exam_id
    AND status = 'in_progress'
  ORDER BY started_at DESC
  LIMIT 1;

  IF _attempt_id IS NOT NULL THEN
    RETURN _attempt_id;
  END IF;

  INSERT INTO public.exam_attempts (exam_id, user_id)
  VALUES (_exam_id, _user_id)
  RETURNING id INTO _attempt_id;

  RETURN _attempt_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.start_or_resume_attempt(UUID) TO authenticated;

-- Return exam questions for an attempt without exposing correct options.
CREATE OR REPLACE FUNCTION public.get_attempt_questions(_attempt_id UUID)
RETURNS TABLE (
  id UUID,
  subject public.subject_type,
  question_text TEXT,
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  marks INTEGER,
  negative_marks NUMERIC,
  question_order INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID := auth.uid();
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.exam_attempts a
    WHERE a.id = _attempt_id
      AND (a.user_id = _user_id OR public.has_role(_user_id, 'admin'))
  ) THEN
    RAISE EXCEPTION 'Attempt not accessible';
  END IF;

  RETURN QUERY
  SELECT q.id, q.subject, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.marks, q.negative_marks, q.question_order
  FROM public.questions q
  JOIN public.exam_attempts a ON a.exam_id = q.exam_id
  WHERE a.id = _attempt_id
  ORDER BY q.question_order;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_attempt_questions(UUID) TO authenticated;

-- Return review data only after submission; includes correct options.
CREATE OR REPLACE FUNCTION public.get_attempt_review(_attempt_id UUID)
RETURNS TABLE (
  question_id UUID,
  subject public.subject_type,
  question_text TEXT,
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  correct_option CHAR(1),
  selected_option CHAR(1),
  marks INTEGER,
  negative_marks NUMERIC,
  question_order INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID := auth.uid();
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.exam_attempts a
    WHERE a.id = _attempt_id
      AND a.status = 'submitted'
      AND (a.user_id = _user_id OR public.has_role(_user_id, 'admin'))
  ) THEN
    RAISE EXCEPTION 'Attempt review not accessible';
  END IF;

  RETURN QUERY
  SELECT
    q.id,
    q.subject,
    q.question_text,
    q.option_a,
    q.option_b,
    q.option_c,
    q.option_d,
    q.correct_option,
    ans.selected_option,
    q.marks,
    q.negative_marks,
    q.question_order
  FROM public.questions q
  JOIN public.exam_attempts a ON a.exam_id = q.exam_id
  LEFT JOIN public.answers ans ON ans.attempt_id = a.id AND ans.question_id = q.id
  WHERE a.id = _attempt_id
  ORDER BY q.question_order;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_attempt_review(UUID) TO authenticated;

-- Submit and score an attempt server-side.
CREATE OR REPLACE FUNCTION public.submit_exam_attempt(_attempt_id UUID)
RETURNS public.exam_attempts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID := auth.uid();
  _attempt public.exam_attempts%ROWTYPE;
  _deadline TIMESTAMPTZ;
  _score NUMERIC(8,2);
  _correct INTEGER;
  _wrong INTEGER;
  _unanswered INTEGER;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT a.*
  INTO _attempt
  FROM public.exam_attempts a
  WHERE a.id = _attempt_id
    AND a.user_id = _user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Attempt not found';
  END IF;

  IF _attempt.status = 'submitted' THEN
    RETURN _attempt;
  END IF;

  SELECT _attempt.started_at + make_interval(mins => e.duration_minutes)
  INTO _deadline
  FROM public.exams e
  WHERE e.id = _attempt.exam_id;

  IF _deadline IS NULL THEN
    RAISE EXCEPTION 'Invalid exam configuration';
  END IF;

  -- Force submission once deadline is reached; still allows manual submit before deadline.
  SELECT
    COALESCE(SUM(CASE WHEN ans.selected_option = q.correct_option THEN q.marks ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN ans.selected_option IS NOT NULL AND ans.selected_option <> q.correct_option THEN 1 ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN ans.selected_option = q.correct_option THEN 1 ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN ans.selected_option IS NULL THEN 1 ELSE 0 END), 0)
  INTO _score, _wrong, _correct, _unanswered
  FROM public.questions q
  LEFT JOIN public.answers ans
    ON ans.attempt_id = _attempt_id
   AND ans.question_id = q.id
  WHERE q.exam_id = _attempt.exam_id;

  SELECT
    _score - COALESCE(SUM(CASE WHEN ans.selected_option IS NOT NULL AND ans.selected_option <> q.correct_option THEN q.negative_marks ELSE 0 END), 0)
  INTO _score
  FROM public.questions q
  LEFT JOIN public.answers ans
    ON ans.attempt_id = _attempt_id
   AND ans.question_id = q.id
  WHERE q.exam_id = _attempt.exam_id;

  UPDATE public.exam_attempts
  SET
    status = 'submitted',
    submitted_at = now(),
    total_score = COALESCE(_score, 0),
    total_correct = COALESCE(_correct, 0),
    total_wrong = COALESCE(_wrong, 0),
    total_unanswered = COALESCE(_unanswered, 0)
  WHERE id = _attempt_id
  RETURNING * INTO _attempt;

  RETURN _attempt;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_exam_attempt(UUID) TO authenticated;

-- Transactional admin exam upsert with question replacement.
CREATE OR REPLACE FUNCTION public.upsert_exam_with_questions(
  _exam_id UUID,
  _title TEXT,
  _description TEXT,
  _duration_minutes INTEGER,
  _questions JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID := auth.uid();
  _resolved_exam_id UUID;
BEGIN
  IF _user_id IS NULL OR NOT public.has_role(_user_id, 'admin') THEN
    RAISE EXCEPTION 'Only admins can save exams';
  END IF;

  IF _exam_id IS NULL THEN
    INSERT INTO public.exams (title, description, duration_minutes, total_marks, created_by)
    VALUES (_title, _description, _duration_minutes, 0, _user_id)
    RETURNING id INTO _resolved_exam_id;
  ELSE
    UPDATE public.exams
    SET title = _title,
        description = _description,
        duration_minutes = _duration_minutes
    WHERE id = _exam_id;
    _resolved_exam_id := _exam_id;
  END IF;

  DELETE FROM public.questions WHERE exam_id = _resolved_exam_id;

  INSERT INTO public.questions (
    exam_id,
    subject,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option,
    marks,
    negative_marks,
    question_order
  )
  SELECT
    _resolved_exam_id,
    (q->>'subject')::public.subject_type,
    q->>'question_text',
    q->>'option_a',
    q->>'option_b',
    q->>'option_c',
    q->>'option_d',
    q->>'correct_option',
    COALESCE((q->>'marks')::INTEGER, 4),
    COALESCE((q->>'negative_marks')::NUMERIC, 1),
    COALESCE((q->>'question_order')::INTEGER, ROW_NUMBER() OVER ())
  FROM jsonb_array_elements(COALESCE(_questions, '[]'::jsonb)) q;

  UPDATE public.exams
  SET total_marks = COALESCE((SELECT SUM(marks) FROM public.questions WHERE exam_id = _resolved_exam_id), 0)
  WHERE id = _resolved_exam_id;

  RETURN _resolved_exam_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_exam_with_questions(UUID, TEXT, TEXT, INTEGER, JSONB) TO authenticated;
