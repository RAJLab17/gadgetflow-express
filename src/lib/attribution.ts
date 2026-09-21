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
