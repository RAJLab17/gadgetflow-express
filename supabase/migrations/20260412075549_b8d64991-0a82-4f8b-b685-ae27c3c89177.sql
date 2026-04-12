
DROP POLICY "Anyone can update visitor count" ON public.visitor_counter;

CREATE OR REPLACE FUNCTION public.increment_visitor_count()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE visitor_counter SET count = count + 1 WHERE id = 1 RETURNING count;
$$;
