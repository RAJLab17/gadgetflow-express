import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";

const NEXUS_HANDLES = [
  "raj-nexus-3in1-wireless-charger",
  "raj-3-in-1-wireless-charger",
];
const FALLBACK_VARIANT_ID = "gid://shopify/ProductVariant/57169031823685";

const PRODUCT_QUERY = `
  query GetProduct($handle: String!) {
    productByHandle(handle: $handle) {
      id title description handle
      priceRange { minVariantPrice { amount currencyCode } }
      images(first: 5) { edges { node { url altText } } }
      variants(first: 10) {
        edges { node { id title availableForSale price { amount currencyCode } selectedOptions { name value } } }
      }
      options { name values }
    }
  }
`;

let cachedProduct: ShopifyProduct | null = null;

async function loadNexusProduct(): Promise<ShopifyProduct | null> {
  if (cachedProduct) return cachedProduct;
  for (const handle of NEXUS_HANDLES) {
    try {
      const data = await storefrontApiRequest(PRODUCT_QUERY, { handle });
      const node = data?.data?.productByHandle;
      if (node) {
        cachedProduct = { node };
        return cachedProduct;
      }
    } catch (e) {
      console.error("loadNexusProduct failed for", handle, e);
    }
  }
  return null;
}

export const OPEN_CART_EVENT = "raj:open-cart";

/**
 * One-click "Add to cart + open drawer" for the NEXUS product.
 * Falls back to direct checkout if product/variant cannot be loaded.
 */
export function useQuickBuy() {
  const [isProcessing, setIsProcessing] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const quickBuy = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate(15); } catch { /* noop */ }
    }

    try {
      const product = await loadNexusProduct();
      const variant = product?.node.variants.edges[0]?.node;

      if (!product || !variant) {
        toast.error("Produkt konnte nicht geladen werden.");
        return;
      }

      await addItem({
        product,
        variantId: variant.id,
        variantTitle: variant.title || "Default",
        price: variant.price || { amount: "99.00", currencyCode: "CHF" },
        quantity: 1,
        selectedOptions: variant.selectedOptions || [],
      });

      const checkoutUrl = useCartStore.getState().checkoutUrl;
      if (!checkoutUrl || typeof window === "undefined") {
        toast.error("Checkout konnte nicht geöffnet werden.");
        return;
      }

      window.location.assign(checkoutUrl);
    } catch (e) {
      console.error("quickBuy failed:", e);
      toast.error("Checkout konnte nicht geöffnet werden.");
    } finally {
      setIsProcessing(false);
    }
  }, [addItem, isProcessing]);

  return { quickBuy, isProcessing };
}
