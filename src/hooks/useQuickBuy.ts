import { useCallback, useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { fetchProductVariantInfo, ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";

const NEXUS_HANDLE = "raj-3-in-1-wireless-charger";
const FALLBACK_VARIANT_ID = "gid://shopify/ProductVariant/57169031823685";

/**
 * One-click buy: adds RAJ NEXUS to cart and opens Shopify checkout in a new tab.
 * The 3-click flow: [Hero "Buy"] → [New tab: Checkout] → [Pay]
 */
export function useQuickBuy() {
  const addItem = useCartStore((s) => s.addItem);
  const [isProcessing, setIsProcessing] = useState(false);

  const quickBuy = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Haptic feedback on mobile (Paket 3 teaser, harmless if unsupported)
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate(15); } catch { /* noop */ }
      }

      const info = await fetchProductVariantInfo(NEXUS_HANDLE);
      const variantId = info?.variantId ?? FALLBACK_VARIANT_ID;

      // Minimal product shell (drawer needs basic product info)
      const product: ShopifyProduct = {
        node: {
          id: variantId,
          title: "RAJ NEXUS — 3-in-1 Wireless Charger",
          description: "Premium 3-in-1 Wireless Charger",
          handle: NEXUS_HANDLE,
          priceRange: { minVariantPrice: { amount: "99.00", currencyCode: "CHF" } },
          images: { edges: [] },
          variants: { edges: [] },
          options: [],
        },
      };

      await addItem({
        product,
        variantId,
        variantTitle: "Space Black",
        price: { amount: "99.00", currencyCode: "CHF" },
        quantity: 1,
        selectedOptions: [{ name: "Color", value: "Space Black" }],
      });

      // Open checkout immediately (re-read store after add)
      const checkoutUrl = useCartStore.getState().getCheckoutUrl();
      if (checkoutUrl) {
        window.open(checkoutUrl, "_blank", "noopener,noreferrer");
      } else {
        toast.error("Checkout konnte nicht geöffnet werden", {
          description: "Bitte versuche es erneut.",
        });
      }
    } catch (error) {
      console.error("Quick buy failed:", error);
      toast.error("Etwas ist schiefgelaufen", {
        description: "Bitte versuche es erneut.",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [addItem, isProcessing]);

  return { quickBuy, isProcessing };
}
