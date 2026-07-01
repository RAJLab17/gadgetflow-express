import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message } = await req.json();

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 1 || name.trim().length > 200) {
      return new Response(
        JSON.stringify({ error: 'Bitte geben Sie einen gültigen Namen ein.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 255) {
      return new Response(
        JSON.stringify({ error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 1 || message.trim().length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Bitte geben Sie eine Nachricht ein.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMessage = message.trim();

    const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!BREVO_API_KEY || !LOVABLE_API_KEY) {
      console.error('Missing BREVO_API_KEY or LOVABLE_API_KEY');
      return new Response(
        JSON.stringify({ error: 'Server-Konfigurationsfehler' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send email via Brevo SMTP API
    const brevoBody = {
      sender: { name: 'RAJ Kontaktformular', email: 'noreply@raj.ch' },
      to: [{ email: 'founder@raj.ch', name: 'RAJ Founder' }],
      replyTo: { email: cleanEmail, name: cleanName },
      subject: `Neue Kontaktanfrage von ${cleanName}`,
      htmlContent: `
        <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #2b2725; background: #faf8f5; padding: 40px 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
              <h2 style="margin-top: 0; font-weight: 300; font-size: 24px; color: #2b2725;">Neue Kontaktanfrage</h2>
              <hr style="border: 0; border-top: 1px solid #e8e2da; margin: 24px 0;" />
              <p style="margin: 8px 0;"><strong style="color: #9b6b3f;">Name:</strong> ${escapeHtml(cleanName)}</p>
              <p style="margin: 8px 0;"><strong style="color: #9b6b3f;">E-Mail:</strong> <a href="mailto:${escapeHtml(cleanEmail)}" style="color: #2b2725;">${escapeHtml(cleanEmail)}</a></p>
              <hr style="border: 0; border-top: 1px solid #e8e2da; margin: 24px 0;" />
              <p style="margin: 8px 0;"><strong style="color: #9b6b3f;">Nachricht:</strong></p>
              <div style="white-space: pre-wrap; background: #faf8f5; padding: 20px; border-radius: 12px; color: #2b2725;">${escapeHtml(cleanMessage)}</div>
              <hr style="border: 0; border-top: 1px solid #e8e2da; margin: 32px 0 16px;" />
              <p style="font-size: 12px; color: #9b6b3f;">Gesendet über raj.ch/kontakt</p>
            </div>
          </body>
        </html>
      `,
    };

    const response = await fetch('https://connector-gateway.lovable.dev/brevo/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': BREVO_API_KEY,
      },
      body: JSON.stringify(brevoBody),
    });

    const responseText = await response.text();
    console.log('Brevo SMTP response:', response.status, responseText);

    if (response.ok) {
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.error('Brevo SMTP API error:', response.status, responseText);
    return new Response(
      JSON.stringify({ error: 'E-Mail konnte nicht gesendet werden.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Interner Serverfehler' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
