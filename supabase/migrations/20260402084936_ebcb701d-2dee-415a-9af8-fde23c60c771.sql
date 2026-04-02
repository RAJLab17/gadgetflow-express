
CREATE TABLE public.launch_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT launch_signups_email_unique UNIQUE (email)
);

ALTER TABLE public.launch_signups ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (signup is public)
CREATE POLICY "Anyone can create launch signups"
ON public.launch_signups
FOR INSERT
WITH CHECK (true);

-- Anyone can count signups (for the public counter)
CREATE POLICY "Anyone can read launch signup count"
ON public.launch_signups
FOR SELECT
USING (true);
