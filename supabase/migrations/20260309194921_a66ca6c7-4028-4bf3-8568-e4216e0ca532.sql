
-- Fix 1: Remove overly permissive ALL policy on abandoned_carts
DROP POLICY IF EXISTS "Service can manage abandoned carts" ON public.abandoned_carts;

-- Fix 2: Add server-side price validation trigger for preorders
CREATE OR REPLACE FUNCTION public.validate_preorder_price()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  expected_final_price numeric;
BEGIN
  -- Enforce discount_percent between 0 and 50 (max 50% discount)
  IF NEW.discount_percent < 0 OR NEW.discount_percent > 50 THEN
    RAISE EXCEPTION 'Invalid discount_percent: must be between 0 and 50';
  END IF;

  -- Enforce original_price is positive
  IF NEW.original_price <= 0 THEN
    RAISE EXCEPTION 'Invalid original_price: must be positive';
  END IF;

  -- Calculate expected final price server-side
  expected_final_price := ROUND(NEW.original_price * (1 - NEW.discount_percent / 100.0), 2);

  -- Allow a small tolerance (0.01) for rounding differences
  IF ABS(NEW.final_price - expected_final_price) > 0.01 THEN
    -- Override with server-calculated price
    NEW.final_price := expected_final_price;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_preorder_price_trigger
  BEFORE INSERT ON public.preorders
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_preorder_price();
