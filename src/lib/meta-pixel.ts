// Lazy-load Supabase so this module doesn't drag the supabase-vendor chunk
// into the critical path of pages that call trackMetaEvent on mount.
const getSupabase = () =>
  import("@/integrations/supabase/client").then((m) => m.supabase);

/**
 * Generate a unique event ID for deduplication between
 * browser Pixel and server-side Conversions API.
 */
export const generateEventId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

/**
 * Fire a Meta Pixel event in the browser AND send it
 * server-side via the Conversions API edge function.
 */
export async function trackMetaEvent(
  eventName: string,
  options: {
    email?: string;
    eventId?: string;
    customData?: Record<string, unknown>;
  } = {}
) {
  const eventId = options.eventId ?? generateEventId();
  const eventTime = Math.floor(Date.now() / 1000);
  const eventSourceUrl = window.location.href;

  // 1. Browser pixel (with event_id for dedup)
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", eventName, options.customData ?? {}, {
      eventID: eventId,
    });
  }

  // 2. Server-side Conversions API (silent — never break the UI)
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.functions.invoke("meta-capi", {
      body: {
        event_name: eventName,
        event_id: eventId,
        event_time: eventTime,
        event_source_url: eventSourceUrl,
        user_agent: navigator.userAgent,
        email: options.email?.trim().toLowerCase(),
        custom_data: options.customData,
      },
    });
    if (error) {
      console.warn("CAPI event failed (non-blocking):", error.message);
    }
  } catch (err) {
    console.warn("CAPI event failed (non-blocking):", err);
  }
}
