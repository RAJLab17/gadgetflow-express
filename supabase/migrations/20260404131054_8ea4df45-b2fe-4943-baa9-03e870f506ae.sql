
CREATE TABLE public.product_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (product_id, fingerprint)
);

ALTER TABLE public.product_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read likes"
  ON public.product_likes
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert likes"
  ON public.product_likes
  FOR INSERT
  WITH CHECK (true);

CREATE INDEX idx_product_likes_product_id ON public.product_likes (product_id);
