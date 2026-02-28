import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

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

    const results = {
      email: { success: false, error: '' },
      shopify: { success: false, draftOrderId: '', error: '' },
    };

    // 1. Send confirmation email via Brevo transactional
    const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY');
    if (BREVO_API_KEY) {
      try {
        // Send customer confirmation
        const customerEmailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': BREVO_API_KEY,
          },
          body: JSON.stringify({
            sender: { name: 'RAJ', email: 'info@raj.ch' },
            to: [{ email: data.customerEmail, name: data.customerName }],
            subject: `Bestellbestätigung – ${data.orderNumber}`,
            htmlContent: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #b8860b;">Vielen Dank für deine Vorbestellung!</h2>
                <p>Hallo ${data.customerName},</p>
                <p>Wir haben deine Vorbestellung erhalten und freuen uns, dass du dabei bist!</p>
                <div style="background: #f9f6f1; padding: 20px; border-radius: 12px; margin: 20px 0;">
                  <p style="margin: 0 0 8px;"><strong>Bestellnummer:</strong> ${data.orderNumber}</p>
                  <p style="margin: 0 0 8px;"><strong>Produkt:</strong> ${data.productName}${data.productVariant ? ` – ${data.productVariant}` : ''}</p>
                  <p style="margin: 0 0 8px;"><strong>Preis:</strong> <span style="text-decoration: line-through;">CHF ${data.originalPrice.toFixed(2)}</span> → <strong style="color: #b8860b;">CHF ${data.finalPrice.toFixed(2)}</strong> (-${data.discountPercent}%)</p>
                </div>
                <div style="background: #f9f6f1; padding: 20px; border-radius: 12px; margin: 20px 0;">
                  <p style="margin: 0 0 4px;"><strong>Lieferadresse:</strong></p>
                  <p style="margin: 0;">${data.customerName}<br>${data.streetAddress}<br>${data.postalCode} ${data.city}</p>
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
            subject: `🛒 Neue Vorbestellung ${data.orderNumber}`,
            htmlContent: `
              <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Neue Vorbestellung eingegangen!</h2>
                <table style="border-collapse: collapse; width: 100%;">
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Bestellnr.</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.orderNumber}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Kunde</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.customerName} (${data.customerEmail})</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Telefon</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.phone || '–'}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Produkt</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.productName}${data.productVariant ? ` – ${data.productVariant}` : ''}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Preis</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">CHF ${data.finalPrice.toFixed(2)} (statt ${data.originalPrice.toFixed(2)}, -${data.discountPercent}%)</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Adresse</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.streetAddress}, ${data.postalCode} ${data.city}</td></tr>
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
                    title: data.productName + (data.productVariant ? ` – ${data.productVariant}` : ''),
                    price: data.finalPrice.toFixed(2),
                    quantity: 1,
                  },
                ],
                customer: {
                  first_name: data.customerName.split(' ')[0],
                  last_name: data.customerName.split(' ').slice(1).join(' ') || '',
                  email: data.customerEmail,
                },
                shipping_address: {
                  first_name: data.customerName.split(' ')[0],
                  last_name: data.customerName.split(' ').slice(1).join(' ') || '',
                  address1: data.streetAddress,
                  city: data.city,
                  zip: data.postalCode,
                  country: 'CH',
                  phone: data.phone || '',
                },
                note: `Vorbestellung ${data.orderNumber} | Originalpreis: CHF ${data.originalPrice.toFixed(2)} | Rabatt: -${data.discountPercent}%`,
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
      JSON.stringify({ error: 'Fehler bei der Verarbeitung', details: error instanceof Error ? error.message : 'Unknown' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
