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

/**
 * Navigate through a real anchor click so the GA4 linker (configured with the
 * checkout domains) can decorate the URL with the `_gl` parameter. Falls back
 * to a plain assign when that is not possible.
 */
function navigate(url: string): void {
  try {
    const a = document.createElement("a");
    a.href = url;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    window.setTimeout(() => {
      a.remove();
      if (!document.hidden) window.location.assign(url);
    }, 300);
  } catch {
    window.location.assign(url);
  }
}

/** Send the user directly to Shopify checkout in the current tab. */
export function goToCheckout(_tab: Window | null, url: string): void {
  navigate(withAttribution(url));
}
