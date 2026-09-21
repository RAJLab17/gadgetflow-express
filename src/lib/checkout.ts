/**
 * Robust checkout navigation.
 *
 * Some mobile browsers (Edge mobile, Samsung Internet) do not reliably hand a
 * pre-opened blank tab over to an external origin: the tab stays on an empty
 * about:blank page and renders "connection refused" for the target host.
 * On those browsers we simply navigate the current tab to the Shopify checkout,
 * which always works. Desktop keeps the pre-opened-tab behaviour.
 */

export function prefersSameTabCheckout(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  const isFragile = /EdgA?\/|SamsungBrowser|OPR\//i.test(ua);
  return isMobile || isFragile;
}

/** Pre-open a blank tab during the user gesture (desktop only). */
export function openCheckoutTab(): Window | null {
  if (prefersSameTabCheckout()) return null;
  try {
    return window.open("", "_blank");
  } catch {
    return null;
  }
}

/** Send the user to the checkout URL, with a same-tab fallback. */
export function goToCheckout(tab: Window | null, url: string): void {
  if (tab && !tab.closed) {
    try {
      tab.location.href = url;
      return;
    } catch {
      /* fall through */
    }
  }
  if (!prefersSameTabCheckout()) {
    const opened = window.open(url, "_blank");
    if (opened) return;
  }
  window.location.assign(url);
}
