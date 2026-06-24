-- 1. New table for emails, service-role only
CREATE TABLE IF NOT EXISTS public.review_emails (
  review_id UUID PRIMARY KEY REFERENCES public.reviews(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.review_emails TO service_role;

ALTER TABLE public.review_emails ENABLE ROW LEVEL SECURITY;
-- No policies for anon/authenticated → completely inaccessible from client.

-- 2. Backfill from existing reviews
INSERT INTO public.review_emails (review_id, email, created_at)
SELECT id, customer_email, created_at FROM public.reviews
ON CONFLICT (review_id) DO NOTHING;

-- 3. Drop client INSERT policy on reviews — submissions go through edge function now
DROP POLICY IF EXISTS "Anyone can submit a review" ON public.reviews;
REVOKE INSERT ON public.reviews FROM anon, authenticated;

-- 4. Replace trigger to not reference customer_email anymore
CREATE OR REPLACE FUNCTION public.reviews_before_insert_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- status/helpful_count/founder_response are set explicitly by the edge function
    IF NEW.status IS NULL THEN NEW.status := 'pending'; END IF;
    NEW.helpful_count := 0;
    NEW.founder_response := NULL;
    NEW.founder_responded_at := NULL;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- 5. Drop the customer_email column
ALTER TABLE public.reviews DROP COLUMN IF EXISTS customer_email;