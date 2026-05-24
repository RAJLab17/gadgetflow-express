-- 1. Drop the permissive public SELECT policy that exposed all emails
DROP POLICY IF EXISTS "Anyone can read launch signup count" ON public.launch_signups;

-- 2. Remove the table from the realtime publication (it may or may not be there)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'launch_signups'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.launch_signups';
  END IF;
END $$;

-- 3. Safe count-only accessors (SECURITY DEFINER) so the public counter still works
CREATE OR REPLACE FUNCTION public.get_launch_signups_total()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::int FROM public.launch_signups;
$$;

CREATE OR REPLACE FUNCTION public.get_launch_signups_today_count()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::int
  FROM public.launch_signups
  WHERE created_at >= date_trunc('day', now() AT TIME ZONE 'UTC');
$$;

REVOKE ALL ON FUNCTION public.get_launch_signups_total() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_launch_signups_today_count() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_launch_signups_total() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_launch_signups_today_count() TO anon, authenticated;