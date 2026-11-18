/** Formats a live Shopify amount; while loading (null) shows «…», never a fixed fallback. */
export function chf(value?: number | string | null): string {
  if (value === null || value === undefined || value === '') return '…';
  const n = Number(value);
  if (!Number.isFinite(n)) return '…';
  return Number.isInteger(n) ? `CHF ${n}.–` : `CHF ${n.toFixed(2)}`;
}
/** Same as chf() without the currency prefix, e.g. «89.–». */
export const chfShort = (value?: number | string | null) => chf(value).replace('CHF ', '');
export const amount = (money?: { amount: string } | null) => (money ? Number(money.amount) : null);

export function comparisonAmount(variant?: { price: { amount: string }; compareAtPrice?: { amount: string } | null }) {
  const price = amount(variant?.price);
  const comparison = amount(variant?.compareAtPrice);
  return price !== null && comparison !== null && Number.isFinite(comparison) && comparison > price ? comparison : null;
}

export function regularPriceTotal(variants: Parameters<typeof comparisonAmount>[0][]) {
  const prices = variants.map(variant => comparisonAmount(variant) ?? amount(variant?.price));
  return prices.reduce<number | null>((sum, price) => sum === null || price === null ? null : sum + price, 0);
}
/** Replaces {{KEY}} tokens in copy (FAQ answers etc.) with live prices. */
export function fillPrices(text: string, prices: Record<string, number | null | undefined>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => chf(prices[key]));
}
