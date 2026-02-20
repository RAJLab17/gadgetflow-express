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
    if (!BREVO_API_KEY) {
      console.error('BREVO_API_KEY secret is missing!');
      return new Response(
        JSON.stringify({ error: 'Server-Konfigurationsfehler' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    console.log('Subscribing email:', cleanEmail);

    // Add contact to Brevo with default list
    const brevoBody = {
      email: cleanEmail,
      updateEnabled: true,
      listIds: [3], // RAJ Newsletter #3
    };

    console.log('Sending to Brevo:', JSON.stringify(brevoBody));

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
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

    // Brevo returns 400 if contact already exists with duplicate_parameter
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
