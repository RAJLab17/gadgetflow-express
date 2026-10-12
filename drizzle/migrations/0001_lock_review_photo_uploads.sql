DROP POLICY IF EXISTS "Visitors can upload pending review photos" ON storage.objects;

CREATE TABLE public.review_upload_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.review_upload_attempts TO service_role;
ALTER TABLE public.review_upload_attempts ENABLE ROW LEVEL SECURITY;
CREATE INDEX review_upload_attempts_ip_time ON public.review_upload_attempts (ip_hash, created_at);