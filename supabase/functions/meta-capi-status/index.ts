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

  try {
    // Validate token by querying the pixel itself
    const url = `https://graph.facebook.com/v21.0/${PIXEL_ID}?fields=name,last_fired_time&access_token=${ACCESS_TOKEN}`;
    const res = await fetch(url);
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
    result.pixel_name = data?.name ?? null;
    result.last_fired_time = data?.last_fired_time ?? null;

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
