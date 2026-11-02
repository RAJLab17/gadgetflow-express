import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { disabledPreorderResponse } from './disabled.ts';

// Retired: PreorderForm has no consumers. Current purchases use Shopify checkout.
// Keep the endpoint deployed, but never read orders or trigger external effects.
Deno.serve((req) => disabledPreorderResponse(req, corsHeaders));
