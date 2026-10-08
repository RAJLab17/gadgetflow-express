/**
 * Robust checkout navigation.
 *
 * Shopify checkout must be loaded as a top-level page. Reusing a pre-opened
 * blank tab can leave checkout in a blocked browsing context on both desktop
 * and mobile browsers, so every purchase now replaces the current page.
 */

import { withAttribution } from "@/lib/attribution";

export function prefersSameTabCheckout(): boolean {
  return true;
}

/** Kept for checkout callers; no separate browsing context is created. */
export function openCheckoutTab(): Window | null {
  return null;
}

function readCookie(name: string): string | undefined {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/[$.]/g, "\\$&") + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}

/**
 * Adds the GA4 cross-domain `_gl` parameter to a checkout URL.
 * 1) Lets gtag's own linker decorate a real anchor (it listens on mousedown).
 * 2) Falls back to google_tag_data.glBridge.generate with the _ga cookies.
 */
export function decorateWithLinker(url: string): string {
  try {
    if (new URL(url).searchParams.has("_gl")) return url;
    const a = document.createElement("a");
    a.href = url;
    a.style.display = "none";
    document.body.appendChild(a);
    a.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
    const decorated = a.href;
    a.remove();
    if (decorated.includes("_gl=")) return decorated;

    const bridge = (window as any).google_tag_data?.glBridge;
    if (bridge?.generate) {
      const cookies: Record<string, string> = {};
      const ga = readCookie("_ga");
      const gs = readCookie("_ga_EST00HSY50");
      if (ga) cookies._ga = ga.replace(/^GA\d\.\d\./, "");
      if (gs) cookies._ga_EST00HSY50 = gs.replace(/^GS\d\.\d\./, "");
      if (Object.keys(cookies).length) {
        const gl = bridge.generate(cookies);
        if (gl) {
          const u = new URL(url);
          u.searchParams.set("_gl", gl);
          return u.toString();
        }
      }
    }
  } catch {
    /* tracking must never block checkout */
  }
  return url;
}

/** Send the user directly to Shopify checkout in the current tab. */
export function goToCheckout(_tab: Window | null, url: string): void {
  window.location.assign(decorateWithLinker(withAttribution(url)));
}
