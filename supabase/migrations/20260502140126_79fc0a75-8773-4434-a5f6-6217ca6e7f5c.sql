
-- Reset count to 2830
UPDATE public.visitor_count SET count = 2830 WHERE id = 1;

-- Create increment RPC (returns new count)
CREATE OR REPLACE FUNCTION public.increment_visitor_count_v2()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.visitor_count
  SET count = count + 1
  WHERE id = 1
  RETURNING count;
$$;

GRANT EXECUTE ON FUNCTION public.increment_visitor_count_v2() TO anon, authenticated;

-- Ensure RLS SELECT policy exists (already does, but safe)
-- Enable realtime
ALTER TABLE public.visitor_count REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.visitor_count;
