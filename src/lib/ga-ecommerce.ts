export interface GaItem {
  item_id: string;
  item_name: string;
  item_variant?: string;
  price: number;
  quantity?: number;
}

/** Fires GA4 add_to_cart + Meta AddToCart, same shape as on /nexus. */
export function trackAddToCart(items: GaItem[]) {
  if (typeof window === "undefined") return;
  try {
    const full = items.map((i) => ({ quantity: 1, ...i }));
    const value = full.reduce((s, i) => s + i.price * i.quantity, 0);
    (window as any).gtag?.("event", "add_to_cart", { currency: "CHF", value, items: full });
    (window as any).fbq?.("track", "AddToCart", {
      value,
      currency: "CHF",
      content_ids: full.map((i) => i.item_id),
      content_type: "product",
    });
  } catch {}
}

/** Fires GA4 view_item once per page mount, same shape as on /nexus. */
export function trackViewItem(item: { item_id: string; item_name: string; price: number }) {
  if (typeof window === "undefined") return;
  try {
    (window as any).gtag?.("event", "view_item", {
      currency: "CHF",
      value: item.price,
      items: [{ ...item, quantity: 1 }],
    });
  } catch {}
}
