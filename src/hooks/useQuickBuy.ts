import { useCallback, useState } from "react";

const CHECKOUT_URL = "https://checkout.raj.ch/cart/57169031823685:1";

/**
 * One-click buy: opens the RAJ Checkout directly.
 * Custom checkout domain — no Shopify URL exposure.
 */
export function useQuickBuy() {
  const [isProcessing, setIsProcessing] = useState(false);

  const quickBuy = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate(15); } catch { /* noop */ }
      }
      window.open(CHECKOUT_URL, "_blank", "noopener,noreferrer");
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  return { quickBuy, isProcessing };
}
