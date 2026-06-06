
-- Remove unused SECURITY DEFINER functions to reduce attack surface
DROP FUNCTION IF EXISTS public.increment_visitor_count();
DROP FUNCTION IF EXISTS public.register_unique_visitor(uuid);

-- Lock down Realtime: app does not use Realtime channels, deny all subscriptions
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Deny all realtime access" ON realtime.messages;
CREATE POLICY "Deny all realtime access"
ON realtime.messages
FOR SELECT
TO anon, authenticated
USING (false);
