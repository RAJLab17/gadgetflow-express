import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * SHA-256 hash helper (Meta requires hashed user data).
 */
async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value.trim().toLowerCase());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PIXEL_ID = Deno.env.get("META_PIXEL_ID");
    const ACCESS_TOKEN = Deno.env.get("META_ACCESS_TOKEN");
    const TEST_EVENT_CODE = Deno.env.get("META_TEST_EVENT_CODE"); // optional

    if (!PIXEL_ID || !ACCESS_TOKEN) {
      console.error("Missing META_PIXEL_ID or META_ACCESS_TOKEN");
      return new Response(
        JSON.stringify({ error: "Server misconfiguration" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const {
      event_name,
      event_id,
      event_time,
      event_source_url,
      user_agent,
      email,
      custom_data,
    } = body;

    if (!event_name) {
      return new Response(
        JSON.stringify({ error: "event_name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build user_data
    const userData: Record<string, string> = {};
    if (email) {
      userData.em = await sha256(email);
    }
    // Get client IP from request headers (forwarded by edge runtime)
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "";
    if (clientIp) {
      userData.client_ip_address = clientIp;
    }
    if (user_agent) {
      userData.client_user_agent = user_agent;
    }

    const eventData: Record<string, unknown> = {
      event_name,
      event_time: event_time || Math.floor(Date.now() / 1000),
      event_id,
      action_source: "website",
      event_source_url,
      user_data: userData,
    };

    if (custom_data && Object.keys(custom_data).length > 0) {
      eventData.custom_data = custom_data;
    }

    const payload: Record<string, unknown> = {
      data: [eventData],
    };

    if (TEST_EVENT_CODE) {
      payload.test_event_code = TEST_EVENT_CODE;
    }

    const url = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;

    const metaRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const metaData = await metaRes.json();

    if (!metaRes.ok) {
      console.error("Meta CAPI error:", JSON.stringify(metaData));
      return new Response(
        JSON.stringify({ error: "Meta API error", details: metaData }),
        { status: metaRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, events_received: metaData.events_received }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("CAPI function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
