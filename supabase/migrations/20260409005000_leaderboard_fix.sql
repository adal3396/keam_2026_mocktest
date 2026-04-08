-- Fix admin leaderboard: allow admins to read profiles and provide a stable leaderboard RPC

-- Allow admins to view all profiles (needed for leaderboard display).
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Return leaderboard rows for an exam (best attempt per user).
CREATE OR REPLACE FUNCTION public.get_exam_leaderboard(_exam_id UUID, _limit INTEGER DEFAULT 50)
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  email TEXT,
  total_score NUMERIC,
  total_correct INTEGER,
  submitted_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH ranked AS (
    SELECT
      a.user_id,
      a.total_score,
      a.total_correct,
      a.submitted_at,
      ROW_NUMBER() OVER (
        PARTITION BY a.user_id
        ORDER BY a.total_score DESC NULLS LAST, a.submitted_at ASC NULLS LAST
      ) AS rn
    FROM public.exam_attempts a
    WHERE a.exam_id = _exam_id
      AND a.status = 'submitted'
  )
  SELECT
    r.user_id,
    COALESCE(p.full_name, '') AS full_name,
    p.email,
    COALESCE(r.total_score, 0) AS total_score,
    COALESCE(r.total_correct, 0) AS total_correct,
    r.submitted_at
  FROM ranked r
  LEFT JOIN public.profiles p ON p.user_id = r.user_id
  WHERE r.rn = 1
  ORDER BY r.total_score DESC NULLS LAST, r.submitted_at ASC NULLS LAST
  LIMIT COALESCE(_limit, 50);
$$;

GRANT EXECUTE ON FUNCTION public.get_exam_leaderboard(UUID, INTEGER) TO authenticated;
