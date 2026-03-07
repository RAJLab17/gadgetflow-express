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
    console.log('Adding to RAJ Runde 2 waitlist:', cleanEmail);

    // First, try to find or create the "RAJ Runde 2" list
    // We'll use list ID 5 - if it doesn't exist, we create it
    let listId = 5;

    // Check if list exists
    const listCheck = await fetch(`https://api.brevo.com/v3/contacts/lists/${listId}`, {
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
      },
    });

    if (!listCheck.ok) {
      // Create the list
      console.log('Creating "RAJ Runde 2" list...');
      const createListRes = await fetch('https://api.brevo.com/v3/contacts/lists', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': BREVO_API_KEY,
        },
        body: JSON.stringify({
          name: 'RAJ Runde 2',
          folderId: 1,
        }),
      });

      if (createListRes.ok) {
        const listData = await createListRes.json();
        listId = listData.id;
        console.log('Created list with ID:', listId);
      } else {
        console.error('Failed to create list:', await createListRes.text());
      }
    }

    // Add contact to the waitlist
    const brevoBody = {
      email: cleanEmail,
      listIds: [listId],
      updateEnabled: true,
      attributes: {
        WAITLIST_SOURCE: 'RAJ Runde 2',
        WAITLIST_DATE: new Date().toISOString(),
      },
    };

    console.log('Sending to Brevo /v3/contacts:', JSON.stringify(brevoBody));

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
