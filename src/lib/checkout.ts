/**
 * Robust checkout navigation.
 *
 * Shopify checkout must be loaded as a top-level page. Reusing a pre-opened
 * blank tab can leave checkout in a blocked browsing context on both desktop
 * and mobile browsers, so every purchase now replaces the current page.
 */

export function prefersSameTabCheckout(): boolean {
  return true;
}

/** Kept for checkout callers; no separate browsing context is created. */
export function openCheckoutTab(): Window | null {
  return null;
}

/** Send the user directly to Shopify checkout in the current tab. */
export function goToCheckout(_tab: Window | null, url: string): void {
  window.location.assign(url);
}
