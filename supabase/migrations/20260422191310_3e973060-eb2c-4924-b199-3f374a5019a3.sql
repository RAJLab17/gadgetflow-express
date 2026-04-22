ALTER TABLE public.launch_signups REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.launch_signups;