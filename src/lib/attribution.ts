/**
 * Captures campaign attribution (UTM / gclid / fbclid) on the first page view
 * of a session and re-attaches it when the visitor is sent to the Shopify
 * checkout domain, so purchases are not counted as "Direct".
 */

const STORAGE_KEY = "raj-attribution";

const PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const;

type Attribution = Partial<Record<(typeof PARAMS)[number], string>>;

function read(): Attribution {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

/** Reads campaign parameters from the current URL and stores them for the session. */
export function captureAttribution(): void {
  captureOrigin();
  try {
    const search = new URLSearchParams(window.location.search);
    const found: Attribution = {};
    for (const key of PARAMS) {
      const value = search.get(key);
      if (value) found[key] = value;
    }
    if (Object.keys(found).length === 0) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...read(), ...found }));
  } catch {
    /* storage unavailable – attribution is simply not persisted */
  }
}

/** Appends the stored campaign parameters to a checkout URL. */
export function withAttribution(url: string): string {
  try {
    const stored = read();
    if (Object.keys(stored).length === 0) return url;
    const parsed = new URL(url);
    for (const [key, value] of Object.entries(stored)) {
      if (value && !parsed.searchParams.has(key)) parsed.searchParams.set(key, value);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

/* ------------------------------------------------------------------ */
/* Visitor origin for Shopify cart attributes (first + last touch).   */
/* Every storage access is guarded; any failure yields an empty list. */
/* ------------------------------------------------------------------ */

const FIRST_KEY = "raj-origin-first";
const LAST_KEY = "raj-origin-last";
const FIRST_TTL_MS = 30 * 24 * 60 * 60 * 1000;

interface Origin {
  source: string;
  medium: string;
  campaign: string;
  referrer: string;
  ts?: number;
}

function clip(value: string): string {
  return value.slice(0, 250);
}

function currentOrigin(): Origin | null {
  try {
    const search = new URLSearchParams(window.location.search);
    let referrer = "";
    try {
      if (document.referrer) {
        const host = new URL(document.referrer).hostname.replace(/^www\./, "");
        const own = window.location.hostname.replace(/^www\./, "");
        if (host && host !== own) referrer = host;
      }
    } catch { /* invalid referrer */ }
    return {
      source: clip(search.get("utm_source") || ""),
      medium: clip(search.get("utm_medium") || ""),
      campaign: clip(search.get("utm_campaign") || ""),
      referrer: clip(referrer),
    };
  } catch {
    return null;
  }
}

function hasData(o: Origin): boolean {
  return Boolean(o.source || o.medium || o.campaign || o.referrer);
}

function readOrigin(storage: Storage, key: string): Origin | null {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as Origin) : null;
  } catch {
    return null;
  }
}

/** Stores first touch (30 days, never overwritten) and last touch (per visit). */
export function captureOrigin(): void {
  try {
    const now = currentOrigin();
    if (!now) return;

    try {
      const first = readOrigin(localStorage, FIRST_KEY);
      const expired = !first || !first.ts || Date.now() - first.ts > FIRST_TTL_MS;
      if (expired) localStorage.setItem(FIRST_KEY, JSON.stringify({ ...now, ts: Date.now() }));
    } catch { /* localStorage blocked */ }

    try {
      const last = readOrigin(sessionStorage, LAST_KEY);
      // New visit, or a new campaign/referrer arrives during the visit.
      if (!last || hasData(now)) sessionStorage.setItem(LAST_KEY, JSON.stringify(now));
    } catch { /* sessionStorage blocked */ }
  } catch { /* ignore */ }
}

/** Cart attributes describing the visitor origin. Never throws. */
export function getOriginCartAttributes(): Array<{ key: string; value: string }> {
  try {
    const out: Array<{ key: string; value: string }> = [];
    const push = (key: string, value?: string) => {
      if (typeof value === "string" && value) out.push({ key, value: clip(value) });
    };
    let first: Origin | null = null;
    let last: Origin | null = null;
    try {
      first = readOrigin(localStorage, FIRST_KEY);
      if (first?.ts && Date.now() - first.ts > FIRST_TTL_MS) first = null;
    } catch { first = null; }
    try { last = readOrigin(sessionStorage, LAST_KEY); } catch { last = null; }

    push("utm_source", last?.source);
    push("utm_medium", last?.medium);
    push("utm_campaign", last?.campaign);
    push("referrer_domain", last?.referrer);
    push("first_source", first?.source);
    push("first_medium", first?.medium);
    push("first_campaign", first?.campaign);
    push("first_referrer", first?.referrer);
    push("last_source", last?.source);
    push("last_medium", last?.medium);
    push("last_campaign", last?.campaign);
    push("last_referrer", last?.referrer);
    return out;
  } catch {
    return [];
  }
}
