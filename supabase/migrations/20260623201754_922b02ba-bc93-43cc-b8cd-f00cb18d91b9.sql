-- Reviews table
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL DEFAULT 'nexus',
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text NOT NULL,
  comment text NOT NULL,
  verified_purchase boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  helpful_count integer NOT NULL DEFAULT 0,
  founder_response text,
  founder_responded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_product_status ON public.reviews(product_id, status, created_at DESC);

-- Auto-set verified_purchase if email matches a preorder; also update updated_at
CREATE OR REPLACE FUNCTION public.reviews_before_insert_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Force pending on insert (clients cannot self-approve)
    NEW.status := 'pending';
    NEW.helpful_count := 0;
    NEW.founder_response := NULL;
    NEW.founder_responded_at := NULL;
    -- Verify purchase via email match in preorders
    IF EXISTS (
      SELECT 1 FROM public.preorders
      WHERE LOWER(customer_email) = LOWER(NEW.customer_email)
    ) THEN
      NEW.verified_purchase := true;
    ELSE
      NEW.verified_purchase := false;
    END IF;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER reviews_biu
BEFORE INSERT OR UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.reviews_before_insert_update();

-- Public view that hides email
CREATE OR REPLACE VIEW public.reviews_public AS
SELECT
  id,
  product_id,
  customer_name,
  rating,
  title,
  comment,
  verified_purchase,
  helpful_count,
  founder_response,
  founder_responded_at,
  created_at
FROM public.reviews
WHERE status = 'approved';

-- Helpful increment RPC (rate-limited via fingerprint table could be added later)
CREATE OR REPLACE FUNCTION public.increment_review_helpful(_review_id uuid)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.reviews
  SET helpful_count = helpful_count + 1
  WHERE id = _review_id AND status = 'approved'
  RETURNING helpful_count;
$$;

-- Aggregate stats RPC
CREATE OR REPLACE FUNCTION public.get_review_stats(_product_id text DEFAULT 'nexus')
RETURNS TABLE(total bigint, average numeric, c5 bigint, c4 bigint, c3 bigint, c2 bigint, c1 bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COUNT(*)::bigint AS total,
    COALESCE(ROUND(AVG(rating)::numeric, 2), 0) AS average,
    COUNT(*) FILTER (WHERE rating = 5)::bigint,
    COUNT(*) FILTER (WHERE rating = 4)::bigint,
    COUNT(*) FILTER (WHERE rating = 3)::bigint,
    COUNT(*) FILTER (WHERE rating = 2)::bigint,
    COUNT(*) FILTER (WHERE rating = 1)::bigint
  FROM public.reviews
  WHERE product_id = _product_id AND status = 'approved';
$$;

-- GRANTS
GRANT INSERT ON public.reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;
GRANT SELECT ON public.reviews_public TO anon, authenticated;
GRANT ALL ON public.reviews_public TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_review_helpful(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_review_stats(text) TO anon, authenticated;

-- RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a review"
ON public.reviews
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
-- No SELECT/UPDATE/DELETE policy => locked; public reads go via reviews_public view (security_invoker default false on views; uses owner privileges)
