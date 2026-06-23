ALTER VIEW public.reviews_public SET (security_invoker = true);
GRANT SELECT ON public.reviews TO anon, authenticated;
-- The view will work because anon/authenticated now have SELECT on the base table,
-- but the table itself has RLS enabled with no SELECT policy, so direct selects are blocked.
-- We need a SELECT policy that only exposes approved rows:
CREATE POLICY "Approved reviews are public"
ON public.reviews
FOR SELECT
TO anon, authenticated
USING (status = 'approved');
