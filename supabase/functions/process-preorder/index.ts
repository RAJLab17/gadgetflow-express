import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Sanitize string to prevent HTML injection in email templates
function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

interface PreorderData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  phone?: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  productName: string;
  productVariant?: string;
  originalPrice: number;
  discountPercent: number;
  finalPrice: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: PreorderData = await req.json();
    console.log('Processing preorder:', data.orderNumber);

    // Validate orderNumber exists in the database before proceeding
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: orderRecord, error: orderError } = await supabase
      .from('preorders')
      .select('order_number, customer_email, customer_name, product_name, product_variant, original_price, discount_percent, final_price, street_address, postal_code, city, phone, email_sent_at')
      .eq('order_number', data.orderNumber)
      .single();

    // Uniform 200 response to prevent order-number enumeration.
    // Silently no-op when the order doesn't exist or was already processed.
    if (orderError || !orderRecord || orderRecord.email_sent_at) {
      if (orderError || !orderRecord) {
        console.warn('process-preorder: order not found or unavailable', data.orderNumber);
      }
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark as processed up-front to prevent concurrent duplicate runs
    await supabase
      .from('preorders')
      .update({ email_sent_at: new Date().toISOString() })
      .eq('order_number', data.orderNumber);

    // Use server-side data from DB instead of client-provided data
    const safeData = {
      orderNumber: orderRecord.order_number,
      customerName: sanitizeHtml(orderRecord.customer_name),
      customerEmail: orderRecord.customer_email,
      phone: orderRecord.phone || '',
      streetAddress: sanitizeHtml(orderRecord.street_address),
      postalCode: sanitizeHtml(orderRecord.postal_code),
      city: sanitizeHtml(orderRecord.city),
      productName: sanitizeHtml(orderRecord.product_name),
      productVariant: orderRecord.product_variant ? sanitizeHtml(orderRecord.product_variant) : '',
      originalPrice: Number(orderRecord.original_price),
      discountPercent: Number(orderRecord.discount_percent),
      finalPrice: Number(orderRecord.final_price),
    };

    const results = {
      email: { success: false, error: '' },
      shopify: { success: false, draftOrderId: '', error: '' },
    };

    // 1. Send confirmation email via Brevo transactional
    const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (BREVO_API_KEY && LOVABLE_API_KEY) {
      try {
        // Send customer confirmation
        const customerEmailRes = await fetch('https://connector-gateway.lovable.dev/brevo/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'X-Connection-Api-Key': BREVO_API_KEY,
          },
          body: JSON.stringify({
            sender: { name: 'RAJ', email: 'info@raj.ch' },
            to: [{ email: safeData.customerEmail, name: safeData.customerName }],
            subject: `Bestellbestätigung – ${safeData.orderNumber}`,
            htmlContent: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #b8860b;">Vielen Dank für deine Vorbestellung!</h2>
                <p>Hallo ${safeData.customerName},</p>
                <p>Wir haben deine Vorbestellung erhalten und freuen uns, dass du dabei bist!</p>
                <div style="background: #f9f6f1; padding: 20px; border-radius: 12px; margin: 20px 0;">
                  <p style="margin: 0 0 8px;"><strong>Bestellnummer:</strong> ${safeData.orderNumber}</p>
                  <p style="margin: 0 0 8px;"><strong>Produkt:</strong> ${safeData.productName}${safeData.productVariant ? ` – ${safeData.productVariant}` : ''}</p>
                  <p style="margin: 0 0 8px;"><strong>Preis:</strong> <span style="text-decoration: line-through;">CHF ${safeData.originalPrice.toFixed(2)}</span> → <strong style="color: #b8860b;">CHF ${safeData.finalPrice.toFixed(2)}</strong> (-${safeData.discountPercent}%)</p>
                </div>
                <div style="background: #f9f6f1; padding: 20px; border-radius: 12px; margin: 20px 0;">
                  <p style="margin: 0 0 4px;"><strong>Lieferadresse:</strong></p>
                  <p style="margin: 0;">${safeData.customerName}<br>${safeData.streetAddress}<br>${safeData.postalCode} ${safeData.city}</p>
                </div>
                <p><strong>Nächste Schritte:</strong></p>
                <ul>
                  <li>Deine persönliche Produktion startet in Kürze</li>
                  <li>Lieferzeit: 2–4 Wochen</li>
                  <li>Wir benachrichtigen dich per E-Mail, sobald dein Produkt versandt wird</li>
                </ul>
                <p>Bei Fragen erreichst du uns jederzeit unter <a href="mailto:info@raj.ch">info@raj.ch</a>.</p>
                <p>Liebe Grüsse,<br><strong>Dein RAJ-Team</strong></p>
              </div>
            `,
          }),
        });

        // Send notification to RAJ team
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': BREVO_API_KEY,
          },
          body: JSON.stringify({
            sender: { name: 'RAJ Shop', email: 'info@raj.ch' },
            to: [{ email: 'info@raj.ch', name: 'RAJ Team' }],
            subject: `🛒 Neue Vorbestellung ${safeData.orderNumber}`,
            htmlContent: `
              <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Neue Vorbestellung eingegangen!</h2>
                <table style="border-collapse: collapse; width: 100%;">
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Bestellnr.</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeData.orderNumber}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Kunde</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeData.customerName} (${safeData.customerEmail})</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Telefon</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeData.phone || '–'}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Produkt</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeData.productName}${safeData.productVariant ? ` – ${safeData.productVariant}` : ''}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Preis</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">CHF ${safeData.finalPrice.toFixed(2)} (statt ${safeData.originalPrice.toFixed(2)}, -${safeData.discountPercent}%)</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Adresse</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeData.streetAddress}, ${safeData.postalCode} ${safeData.city}</td></tr>
                </table>
              </div>
            `,
          }),
        });

        results.email = { success: customerEmailRes.ok, error: customerEmailRes.ok ? '' : `Status ${customerEmailRes.status}` };
        console.log('Email sent:', results.email);
      } catch (e) {
        results.email = { success: false, error: e instanceof Error ? e.message : 'Unknown' };
        console.error('Email error:', e);
      }
    } else {
      results.email = { success: false, error: 'BREVO_API_KEY not configured' };
    }

    // 2. Create Shopify Draft Order
    const SHOPIFY_ACCESS_TOKEN = Deno.env.get('SHOPIFY_ACCESS_TOKEN');
    const SHOPIFY_STORE = 'kcvjif-10.myshopify.com';
    if (SHOPIFY_ACCESS_TOKEN) {
      try {
        const draftOrderRes = await fetch(
          `https://${SHOPIFY_STORE}/admin/api/2025-07/draft_orders.json`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
            },
            body: JSON.stringify({
              draft_order: {
                line_items: [
                  {
                    title: safeData.productName + (safeData.productVariant ? ` – ${safeData.productVariant}` : ''),
                    price: safeData.finalPrice.toFixed(2),
                    quantity: 1,
                  },
                ],
                customer: {
                  first_name: safeData.customerName.split(' ')[0],
                  last_name: safeData.customerName.split(' ').slice(1).join(' ') || '',
                  email: safeData.customerEmail,
                },
                shipping_address: {
                  first_name: safeData.customerName.split(' ')[0],
                  last_name: safeData.customerName.split(' ').slice(1).join(' ') || '',
                  address1: safeData.streetAddress,
                  city: safeData.city,
                  zip: safeData.postalCode,
                  country: 'CH',
                  phone: safeData.phone || '',
                },
                note: `Vorbestellung ${safeData.orderNumber} | Originalpreis: CHF ${safeData.originalPrice.toFixed(2)} | Rabatt: -${safeData.discountPercent}%`,
                tags: 'vorbestellung, lovable',
              },
            }),
          }
        );

        const draftOrderData = await draftOrderRes.json();
        if (draftOrderRes.ok && draftOrderData.draft_order) {
          results.shopify = { success: true, draftOrderId: String(draftOrderData.draft_order.id), error: '' };
        } else {
          results.shopify = { success: false, draftOrderId: '', error: JSON.stringify(draftOrderData.errors || draftOrderData) };
        }
        console.log('Shopify draft order:', results.shopify);
      } catch (e) {
        results.shopify = { success: false, draftOrderId: '', error: e instanceof Error ? e.message : 'Unknown' };
        console.error('Shopify error:', e);
      }
    } else {
      results.shopify = { success: false, draftOrderId: '', error: 'SHOPIFY_ACCESS_TOKEN not configured' };
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Process preorder error:', error);
    return new Response(
      JSON.stringify({ error: 'Fehler bei der Verarbeitung' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
