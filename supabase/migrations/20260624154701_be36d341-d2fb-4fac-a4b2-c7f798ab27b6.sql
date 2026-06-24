DROP POLICY IF EXISTS "Approved reviews are public" ON public.reviews;
REVOKE SELECT ON public.reviews FROM anon;