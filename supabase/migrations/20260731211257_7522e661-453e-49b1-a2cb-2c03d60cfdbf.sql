CREATE TABLE IF NOT EXISTS public.product_catalog_prices (
  product_name text PRIMARY KEY,
  original_price numeric NOT NULL CHECK (original_price > 0),
  min_final_price numeric NOT NULL CHECK (min_final_price > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.product_catalog_prices TO service_role;
ALTER TABLE public.product_catalog_prices ENABLE ROW LEVEL SECURITY;

INSERT INTO public.product_catalog_prices (product_name, original_price, min_final_price) VALUES
  ('RAJ NEXUS 3-in-1 Wireless Charger', 129.00, 99.00)
ON CONFLICT (product_name) DO UPDATE
  SET original_price = EXCLUDED.original_price,
      min_final_price = EXCLUDED.min_final_price,
      updated_at = now();

CREATE OR REPLACE FUNCTION public.validate_preorder_price()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  catalog_row public.product_catalog_prices%ROWTYPE;
  expected_final_price numeric;
BEGIN
  SELECT * INTO catalog_row
  FROM public.product_catalog_prices
  WHERE product_name = NEW.product_name;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Unknown product: preorders are only accepted for catalog products';
  END IF;

  -- Base price must match the current catalog price exactly (no client tampering)
  IF NEW.original_price IS DISTINCT FROM catalog_row.original_price THEN
    NEW.original_price := catalog_row.original_price;
  END IF;

  IF NEW.discount_percent IS NULL OR NEW.discount_percent < 0 OR NEW.discount_percent > 50 THEN
    RAISE EXCEPTION 'Invalid discount_percent: must be between 0 and 50';
  END IF;

  -- Force server-side calculation of final_price
  expected_final_price := ROUND(NEW.original_price * (1 - NEW.discount_percent / 100.0), 2);

  IF expected_final_price < catalog_row.min_final_price THEN
    expected_final_price := catalog_row.min_final_price;
  END IF;

  NEW.final_price := expected_final_price;
  RETURN NEW;
END;
$function$;