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
/** Replaces {{KEY}} tokens in copy (FAQ answers etc.) with live prices. */
export function fillPrices(text: string, prices: Record<string, number | null | undefined>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => chf(prices[key]));
}
