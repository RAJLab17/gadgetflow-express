import { useCallback, useRef } from "react";

const CHECKOUT_URL = "https://checkout.raj.ch/cart/57169031823685:1";

export const OPEN_CART_EVENT = "raj:open-cart";

/**
 * Direct checkout redirect. No cart creation — goes straight to the
 * hardcoded Shopify checkout URL with a debounce guard.
 */
export function useQuickBuy() {
  const lastClick = useRef(0);

  const quickBuy = useCallback(() => {
    const now = Date.now();
    if (now - lastClick.current < 1000) return;
    lastClick.current = now;
    window.location.href = CHECKOUT_URL;
  }, []);

  return { quickBuy, isProcessing: false };
}
