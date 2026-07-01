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
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Ungültige E-Mail-Adresse' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!BREVO_API_KEY || !LOVABLE_API_KEY) {
      console.error('Missing BREVO_API_KEY or LOVABLE_API_KEY');
      return new Response(
        JSON.stringify({ error: 'Server-Konfigurationsfehler' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    console.log('Creating/updating contact for DOI:', cleanEmail);

    const brevoBody = {
      email: cleanEmail,
      listIds: [9],
      updateEnabled: true,
    };

    const response = await fetch('https://connector-gateway.lovable.dev/brevo/contacts', {
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
    console.log('Brevo response:', response.status, responseText);

    // 201 = created, 204 = updated existing contact
    if (response.ok || response.status === 201 || response.status === 204) {
      // Track signup in launch_signups table for the live counter
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        await fetch(`${supabaseUrl}/rest/v1/launch_signups`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'resolution=ignore-duplicates',
          },
          body: JSON.stringify({ email: cleanEmail }),
        });
      } catch (dbErr) {
        console.error('Failed to track signup in DB:', dbErr);
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Contact already exists with duplicate_parameter
    if (response.status === 400) {
      try {
        const errData = JSON.parse(responseText);
        if (errData.code === 'duplicate_parameter') {
          return new Response(
            JSON.stringify({ success: true, message: 'Bereits angemeldet' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch { /* ignore parse error */ }
    }

    console.error('Brevo API error:', response.status, responseText);
    return new Response(
      JSON.stringify({ error: 'Anmeldung fehlgeschlagen', details: responseText }),
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
