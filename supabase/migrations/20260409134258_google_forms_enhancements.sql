-- Delete existing questions to avoid constraint violations if there's any mismatch (approved by user)
DELETE FROM public.answers;
DELETE FROM public.questions;

-- Add new columns
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS option_e TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update the check constraint for correct_option to allow 'E'
ALTER TABLE public.questions DROP CONSTRAINT IF EXISTS questions_correct_option_check;
ALTER TABLE public.questions ADD CONSTRAINT questions_correct_option_check CHECK (correct_option IN ('A','B','C','D','E'));

-- Ensure storage schema/features are aligned
INSERT INTO storage.buckets (id, name, public) 
VALUES ('exam-images', 'exam-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for exam-images
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'exam-images');

DROP POLICY IF EXISTS "Admins can upload exam images" ON storage.objects;
CREATE POLICY "Admins can upload exam images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'exam-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update exam images" ON storage.objects;
CREATE POLICY "Admins can update exam images" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'exam-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete exam images" ON storage.objects;
CREATE POLICY "Admins can delete exam images" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'exam-images' AND public.has_role(auth.uid(), 'admin'));

-- Update RPCs to handle option_e and image_url
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
    image_url,
    option_a,
    option_b,
    option_c,
    option_d,
    option_e,
    correct_option,
    marks,
    negative_marks,
    question_order
  )
  SELECT
    _resolved_exam_id,
    (q->>'subject')::public.subject_type,
    q->>'question_text',
    q->>'image_url',
    q->>'option_a',
    q->>'option_b',
    q->>'option_c',
    q->>'option_d',
    q->>'option_e',
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

DROP FUNCTION IF EXISTS public.get_attempt_questions(UUID);

CREATE OR REPLACE FUNCTION public.get_attempt_questions(_attempt_id UUID)
RETURNS TABLE (
  id UUID,
  subject public.subject_type,
  question_text TEXT,
  image_url TEXT,
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  option_e TEXT,
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
  SELECT q.id, q.subject, q.question_text, q.image_url, q.option_a, q.option_b, q.option_c, q.option_d, q.option_e, q.marks, q.negative_marks, q.question_order
  FROM public.questions q
  JOIN public.exam_attempts a ON a.exam_id = q.exam_id
  WHERE a.id = _attempt_id
  ORDER BY q.question_order;
END;
$$;

DROP FUNCTION IF EXISTS public.get_attempt_review(UUID);

CREATE OR REPLACE FUNCTION public.get_attempt_review(_attempt_id UUID)
RETURNS TABLE (
  question_id UUID,
  subject public.subject_type,
  question_text TEXT,
  image_url TEXT,
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  option_e TEXT,
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
    q.image_url,
    q.option_a,
    q.option_b,
    q.option_c,
    q.option_d,
    q.option_e,
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
