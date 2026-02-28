
CREATE TABLE public.abandoned_carts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_variant TEXT,
  original_price NUMERIC NOT NULL,
  final_price NUMERIC NOT NULL,
  shopify_draft_order_id TEXT,
  converted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create abandoned carts"
ON public.abandoned_carts
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service can manage abandoned carts"
ON public.abandoned_carts
FOR ALL
USING (true);
