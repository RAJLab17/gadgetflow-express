import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const SHOPIFY_ACCESS_TOKEN = Deno.env.get('SHOPIFY_ACCESS_TOKEN');
  const SHOPIFY_STORE = 'kcvjif-10.myshopify.com';
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { action, email, productName, productVariant, originalPrice, finalPrice, abandonedCartId } = await req.json();

    // ACTION: track - save abandoned cart + create Shopify draft order
    if (action === 'track') {
      if (!email || !productName) {
        return new Response(JSON.stringify({ error: 'Missing fields' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      // Validate prices are positive numbers in plausible range
      const op = Number(originalPrice);
      const fp = Number(finalPrice);
      if (!Number.isFinite(op) || !Number.isFinite(fp) || op <= 0 || fp <= 0 || op > 10000 || fp > 10000 || fp > op) {
        return new Response(JSON.stringify({ error: 'Invalid price' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      // Basic email shape check
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
        return new Response(JSON.stringify({ error: 'Invalid email' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check if already tracked for this email+product
      const { data: existing } = await supabase
        .from('abandoned_carts')
        .select('id')
        .eq('customer_email', email)
        .eq('product_name', productName)
        .eq('converted', false)
        .maybeSingle();

      if (existing) {
        return new Response(JSON.stringify({ success: true, id: existing.id, alreadyTracked: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let shopifyDraftOrderId = null;

      // Create Shopify draft order tagged "abandoned"
      if (SHOPIFY_ACCESS_TOKEN) {
        try {
          const res = await fetch(`https://${SHOPIFY_STORE}/admin/api/2025-07/draft_orders.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
            },
            body: JSON.stringify({
              draft_order: {
                line_items: [{
                  title: productName + (productVariant ? ` – ${productVariant}` : ''),
                  price: finalPrice.toFixed(2),
                  quantity: 1,
                }],
                customer: { email },
                note: 'Abgebrochener Checkout – Kunde hat Formular nicht abgeschlossen',
                tags: 'abandoned, vorbestellung-abgebrochen',
              },
            }),
          });

          const data = await res.json();
          if (res.ok && data.draft_order) {
            shopifyDraftOrderId = String(data.draft_order.id);
          }
          console.log('Shopify abandoned draft order:', shopifyDraftOrderId);
        } catch (e) {
          console.error('Shopify abandoned draft order error:', e);
        }
      }

      // Save to DB
      const { data: inserted, error } = await supabase
        .from('abandoned_carts')
        .insert({
          customer_email: email,
          product_name: productName,
          product_variant: productVariant || null,
          original_price: originalPrice,
          final_price: finalPrice,
          shopify_draft_order_id: shopifyDraftOrderId,
        })
        .select('id')
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, id: inserted.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ACTION: convert — REMOVED as a client-callable action.
    // The abandoned-cart conversion (marking converted + deleting the Shopify
    // draft order) is now performed exclusively from the process-preorder edge
    // function after it has verified the preorder exists in the database.
    // Exposing it as a public action allowed callers to (a) enumerate whether
    // a given email had purchased a given product via the 403/200 response
    // difference and (b) delete another customer's Shopify draft order and
    // flip their abandoned_carts.converted flag without ownership proof.
    if (action === 'convert') {
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Abandoned cart error:', error);
    return new Response(
      JSON.stringify({ error: 'Fehler', details: error instanceof Error ? error.message : 'Unknown' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
