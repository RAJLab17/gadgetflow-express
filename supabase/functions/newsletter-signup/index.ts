import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiting
const recentSignups = new Map<string, number>();

function cleanOldEntries() {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [key, timestamp] of recentSignups) {
    if (timestamp < oneHourAgo) recentSignups.delete(key);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    // Validate email
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!email || !emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Ungültige E-Mail-Adresse" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limiting: max 50 signups per hour globally
    cleanOldEntries();
    if (recentSignups.size >= 50) {
      return new Response(
        JSON.stringify({ error: "Zu viele Anmeldungen. Bitte versuche es später erneut." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check duplicate within session
    if (recentSignups.has(email)) {
      return new Response(
        JSON.stringify({ success: true, message: "Bereits angemeldet" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    recentSignups.set(email, Date.now());

    // Send notification email to newsletter@raj.ch
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    if (RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "RAJ Newsletter <onboarding@resend.dev>",
          to: ["newsletter@raj.ch"],
          subject: `Neue Newsletter-Anmeldung: ${email}`,
          html: `<p>Neue Newsletter-Anmeldung:</p><p><strong>${email}</strong></p><p>Zeitpunkt: ${new Date().toISOString()}</p>`,
        }),
      });
    } else {
      console.log(`Newsletter signup (no RESEND_API_KEY configured): ${email}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return new Response(
      JSON.stringify({ error: "Ein Fehler ist aufgetreten" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
