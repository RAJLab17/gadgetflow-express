-- Server-only writes (edge functions use service role)
DROP POLICY IF EXISTS "Anyone can create abandoned carts" ON public.abandoned_carts;
DROP POLICY IF EXISTS "Anyone can create launch signups" ON public.launch_signups;
DROP POLICY IF EXISTS "Anyone can insert unique visitors" ON public.unique_visitors;

-- Single-row public counters: scope reads to the counter row
DROP POLICY IF EXISTS "Anyone can read founder stock" ON public.founder_stock;
CREATE POLICY "Public can read founder stock row" ON public.founder_stock FOR SELECT TO anon, authenticated USING (id = 1);
DROP POLICY IF EXISTS "Anyone can read visitor count" ON public.visitor_count;
CREATE POLICY "Public can read visitor count row" ON public.visitor_count FOR SELECT TO anon, authenticated USING (id = 1);
DROP POLICY IF EXISTS "Anyone can read visitor count" ON public.visitor_counter;
CREATE POLICY "Public can read visitor counter row" ON public.visitor_counter FOR SELECT TO anon, authenticated USING (id = 1);

-- Likes: validate content
DROP POLICY IF EXISTS "Anyone can insert likes" ON public.product_likes;
CREATE POLICY "Visitors can add valid likes" ON public.product_likes FOR INSERT TO anon, authenticated
WITH CHECK (length(product_id) BETWEEN 1 AND 64 AND length(fingerprint) BETWEEN 8 AND 128);

-- Preorders: validate content; workflow fields stay at defaults
DROP POLICY IF EXISTS "Anyone can create preorders" ON public.preorders;
CREATE POLICY "Visitors can submit valid preorders" ON public.preorders FOR INSERT TO anon, authenticated
WITH CHECK (
  length(customer_name) BETWEEN 1 AND 200
  AND customer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(customer_email) <= 255
  AND length(street_address) BETWEEN 1 AND 300
  AND length(postal_code) BETWEEN 1 AND 20
  AND length(city) BETWEEN 1 AND 120
  AND quantity BETWEEN 1 AND 10
  AND status = 'pending'
  AND production_started_at IS NULL AND shipped_at IS NULL AND email_sent_at IS NULL
);

-- Storage: public bucket files are served by URL; no listing needed
DROP POLICY IF EXISTS "Public read individual public-assets objects" ON storage.objects;

-- Review photo uploads: only random-named images in pending/, no owner claim
DROP POLICY IF EXISTS "Anyone can upload pending review photos" ON storage.objects;
CREATE POLICY "Visitors can upload pending review photos" ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (
  bucket_id = 'review-photos'
  AND (storage.foldername(name))[1] = 'pending'
  AND name ~ '^pending/[0-9a-f-]{36}\.(jpg|jpeg|png|webp|heic)$'
  AND owner IS NULL OR (bucket_id = 'review-photos' AND (storage.foldername(name))[1] = 'pending'
  AND name ~ '^pending/[0-9a-f-]{36}\.(jpg|jpeg|png|webp|heic)$' AND owner_id = (select auth.uid()::text))
);