
-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can view orders by email" ON public.preorders;

-- Create a restrictive SELECT policy: only visible if no one is logged in = no access, 
-- or if logged in user's email matches the order email
CREATE POLICY "Users can view own orders by email"
ON public.preorders
FOR SELECT
TO public
USING (customer_email = (auth.jwt()->>'email'));
