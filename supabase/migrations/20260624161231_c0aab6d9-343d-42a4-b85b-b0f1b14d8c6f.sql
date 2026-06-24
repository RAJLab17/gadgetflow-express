-- Allow public read of approved reviews directly (no sensitive columns in this table)
CREATE POLICY "Approved reviews are publicly readable"
  ON public.reviews
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

GRANT SELECT ON public.reviews TO anon, authenticated;

-- Switch reviews_public view back to security_invoker so it respects caller's RLS
ALTER VIEW public.reviews_public SET (security_invoker = on);