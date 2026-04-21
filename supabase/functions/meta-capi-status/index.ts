import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const PIXEL_ID = Deno.env.get("META_PIXEL_ID");
  const ACCESS_TOKEN = Deno.env.get("META_ACCESS_TOKEN");

  const result: Record<string, unknown> = {
    pixel_id_configured: !!PIXEL_ID,
    access_token_configured: !!ACCESS_TOKEN,
    pixel_id: PIXEL_ID ?? null,
    checked_at: new Date().toISOString(),
  };

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    result.status = "misconfigured";
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // True validation: send a real (test) CAPI event. This is what production
  // events use, so success here proves the token can deliver events.
  try {
    const url = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
    const payload = {
      data: [
        {
          event_name: "PageView",
          event_time: Math.floor(Date.now() / 1000),
          event_id: `health-check-${Date.now()}`,
          action_source: "website",
          event_source_url: "https://raj.ch/_health",
          user_data: {
            client_user_agent: "RAJ-CAPI-Health-Check/1.0",
          },
        },
      ],
      test_event_code: "TEST_HEALTH_CHECK",
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok || data?.error) {
      result.status = "token_invalid";
      result.error = data?.error ?? null;
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    result.status = "active";
    result.events_received = data?.events_received ?? null;
    result.fbtrace_id = data?.fbtrace_id ?? null;

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    result.status = "error";
    result.error = String(err);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
