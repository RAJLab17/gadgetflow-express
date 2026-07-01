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
    console.log('Adding to RAJ Runde 2 waitlist:', cleanEmail);

    const listId = 8;
    const brevoBody = {
      email: cleanEmail,
      listIds: [listId],
      updateEnabled: true,
      attributes: {
        WAITLIST_SOURCE: 'RAJ Runde 2',
        WAITLIST_DATE: new Date().toISOString(),
      },
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

    if (response.ok || response.status === 201 || response.status === 204) {
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Contact already exists
    if (response.status === 400) {
      try {
        const errData = JSON.parse(responseText);
        if (errData.code === 'duplicate_parameter') {
          return new Response(
            JSON.stringify({ success: true, message: 'Bereits auf der Warteliste' }),
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
