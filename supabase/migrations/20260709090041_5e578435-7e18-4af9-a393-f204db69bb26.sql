
-- Add optional photo columns to reviews
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS photo_path TEXT,
  ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Recreate public view to include photo_url (only approved reviews expose it)
DROP VIEW IF EXISTS public.reviews_public;
CREATE VIEW public.reviews_public
WITH (security_invoker = true)
AS
SELECT
  id, product_id, customer_name, rating, title, comment,
  verified_purchase, helpful_count, founder_response, founder_responded_at,
  created_at, photo_url
FROM public.reviews
WHERE status = 'approved';

GRANT SELECT ON public.reviews_public TO anon, authenticated;

-- Storage RLS: allow public (anon) to upload only into pending/ inside review-photos.
-- No SELECT/UPDATE/DELETE for anon — service role handles all reads (via signed URLs)
-- and moves during approval, so pending photos are never publicly reachable.
CREATE POLICY "Anyone can upload pending review photos"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'review-photos'
  AND (storage.foldername(name))[1] = 'pending'
);
