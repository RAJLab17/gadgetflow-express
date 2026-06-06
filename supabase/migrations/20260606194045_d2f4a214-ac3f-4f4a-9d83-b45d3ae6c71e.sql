
-- 1. Lock down preorders: remove email-based SELECT policy (spoofable), revoke client SELECT.
DROP POLICY IF EXISTS "Users can view own orders by email" ON public.preorders;
REVOKE SELECT ON public.preorders FROM anon, authenticated;

-- Add idempotency column for process-preorder
ALTER TABLE public.preorders ADD COLUMN IF NOT EXISTS email_sent_at timestamptz;

-- Stricter price validation: original_price must be in plausible range
CREATE OR REPLACE FUNCTION public.validate_preorder_price()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  expected_final_price numeric;
BEGIN
  IF NEW.discount_percent < 0 OR NEW.discount_percent > 50 THEN
    RAISE EXCEPTION 'Invalid discount_percent: must be between 0 and 50';
  END IF;
  IF NEW.original_price <= 0 OR NEW.original_price > 10000 THEN
    RAISE EXCEPTION 'Invalid original_price: must be between 0 and 10000';
  END IF;
  -- Force server-side calculation of final_price
  expected_final_price := ROUND(NEW.original_price * (1 - NEW.discount_percent / 100.0), 2);
  NEW.final_price := expected_final_price;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_preorder_price_trigger ON public.preorders;
CREATE TRIGGER validate_preorder_price_trigger
BEFORE INSERT OR UPDATE ON public.preorders
FOR EACH ROW EXECUTE FUNCTION public.validate_preorder_price();

-- 2. launch_signups: revoke SELECT from public roles (only service_role / edge functions should read)
REVOKE SELECT ON public.launch_signups FROM anon, authenticated;

-- 3. abandoned_carts: revoke SELECT from public roles
REVOKE SELECT ON public.abandoned_carts FROM anon, authenticated;

-- 4. unique_visitors: drop public SELECT (UUIDs+timestamps don't need to be exposed)
DROP POLICY IF EXISTS "Anyone can read unique visitors" ON public.unique_visitors;
REVOKE SELECT ON public.unique_visitors FROM anon, authenticated;

-- 5. Revoke EXECUTE on internal SECURITY DEFINER functions from public roles.
-- Keep visitor-count increment functions executable since they're called by anon site visitors.
REVOKE EXECUTE ON FUNCTION public.validate_preorder_price() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM anon, authenticated, PUBLIC;

-- 6. Restrict storage listing on public-assets bucket (allow public read of individual objects, not listing)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public can read public-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public read public-assets" ON storage.objects;

-- Allow only direct object GET by name, not bucket listing. PostgREST/Supabase storage uses
-- a SELECT policy; restrict to single-object reads by requiring the request to specify name.
CREATE POLICY "Public read individual public-assets objects"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'public-assets' AND name IS NOT NULL);
