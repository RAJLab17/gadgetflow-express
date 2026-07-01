
-- ============================================================
-- 1) product_likes: hide fingerprints, expose only aggregate count
-- ============================================================

-- Remove public SELECT policy that exposed fingerprints
DROP POLICY IF EXISTS "Anyone can read likes" ON public.product_likes;

-- Revoke direct read access
REVOKE SELECT ON public.product_likes FROM anon, authenticated;

-- Ensure service_role retains full access for edge functions/admin
GRANT ALL ON public.product_likes TO service_role;

-- Aggregate-only RPC (does not leak fingerprints)
CREATE OR REPLACE FUNCTION public.get_product_like_count(_product_id text)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::int
  FROM public.product_likes
  WHERE product_id = _product_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_product_like_count(text) TO anon, authenticated;

-- ============================================================
-- 2) review_emails: explicitly lock down against public access
-- ============================================================

-- Defensive: revoke any SELECT/INSERT/UPDATE/DELETE from public roles.
-- Only service_role (used by edge functions) may access this table.
REVOKE ALL ON public.review_emails FROM anon, authenticated, public;
GRANT ALL ON public.review_emails TO service_role;

-- Ensure RLS is enabled (deny-by-default without policies)
ALTER TABLE public.review_emails ENABLE ROW LEVEL SECURITY;
