import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { CartItem, createShopifyCart, fetchProductVariantInfo } from "@/lib/shopify";
import { makeOrderReference, usePendingCheckout } from "@/hooks/usePendingCheckout";
import { goToCheckout, openCheckoutTab } from "@/lib/checkout";

export const OPEN_CART_EVENT = "raj:open-cart";

export function useQuickBuy() {
  const lastClick = useRef(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { track } = usePendingCheckout();

  const quickBuy = useCallback(async () => {
    const now = Date.now();
    if (now - lastClick.current < 1000 || isProcessing) return;
    lastClick.current = now;
    setIsProcessing(true);
    const checkoutTab = openCheckoutTab();
    try {
      const variant = await fetchProductVariantInfo("raj-3-in-1-wireless-charger");
      if (!variant?.availableForSale) {
        checkoutTab?.close();
        toast.error("NEXUS ist derzeit nicht verfügbar.");
        return;
      }
      const reference = makeOrderReference();
      const product: CartItem["product"] = {
        node: {
          id: "gid://shopify/Product/15693851623749",
          title: "RAJ NEXUS 3-in-1 Qi2.2 Wireless Charger",
          description: "3-in-1 Qi2.2 Wireless Charger",
          handle: "raj-3-in-1-wireless-charger",
          priceRange: { minVariantPrice: { amount: "99", currencyCode: "CHF" } },
          images: { edges: [] },
          variants: { edges: [] },
          options: [],
        },
      };
      const cart = await createShopifyCart({
        lineId: null,
        product,
        variantId: variant.variantId,
        variantTitle: "Space Black",
        price: { amount: "99", currencyCode: "CHF" },
        quantity: 1,
        selectedOptions: [],
      }, undefined, [
        { key: "RAJ Referenz", value: reference },
        { key: "Quelle", value: "raj.ch/nexus" },
      ]);
      if (!cart) {
        checkoutTab?.close();
        toast.error("Der Checkout konnte nicht geöffnet werden. Bitte versuche es erneut.");
        return;
      }
      track({ cartId: cart.cartId, reference, summary: "RAJ NEXUS", total: "CHF 99.–", startedAt: Date.now() });
      goToCheckout(checkoutTab, cart.checkoutUrl);
    } catch (error) {
      checkoutTab?.close();
      console.error("NEXUS checkout failed:", error);
      toast.error("Der Checkout konnte nicht geöffnet werden. Bitte versuche es erneut.");
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, track]);

  return { quickBuy, isProcessing };
}
