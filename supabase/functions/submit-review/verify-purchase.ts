export type ProductId = 'nexus' | 'matrix' | 'airpods-case'
const VARIANTS: Record<ProductId, readonly string[]> = {
  nexus: [],
  matrix: ['59116736545093', '59116736577861', '59116736610629', '59116736643397', '59116736676165', '59116736708933', '59116736741701', '59116736774469'],
  'airpods-case': ['59116737364293', '59116737397061'],
}
type Order = {
  name?: string; email?: string; cancelled_at?: string | null; financial_status?: string;
  line_items?: Array<{ product_id?: number | string; variant_id?: number | string; quantity?: number }>;
}
export function matchesPurchase(order: Order, productId: ProductId, orderNumber: string, email: string) {
  const normalizeOrder = (value: string) => value.trim().replace(/^#/, '').toLowerCase();
  return normalizeOrder(order.name ?? '') === normalizeOrder(orderNumber)
    && (order.email ?? '').trim().toLowerCase() === email.trim().toLowerCase()
    && !order.cancelled_at && ['paid', 'partially_refunded'].includes(order.financial_status ?? '')
    && !!order.line_items?.some(item => (item.quantity ?? 0) > 0 && (productId === 'nexus'
      ? String(item.product_id) === '15693851623749'
      : VARIANTS[productId].includes(String(item.variant_id))));
}
export async function verifyPurchase(productId: ProductId, orderNumber: string | undefined, email: string, token: string | undefined) {
  if (!orderNumber) return false;
  if (!token) throw new Error('verification_unavailable');
  const url = new URL('https://kcvjif-10.myshopify.com/admin/api/2025-07/orders.json');
  url.searchParams.set('status', 'any');
  url.searchParams.set('name', orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`);
  url.searchParams.set('limit', '250');
  url.searchParams.set('fields', 'name,email,cancelled_at,financial_status,line_items');
  const response = await fetch(url, { headers: { 'X-Shopify-Access-Token': token }, signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error('verification_unavailable');
  const body = await response.json() as { orders?: Order[] };
  if (!Array.isArray(body.orders)) throw new Error('verification_unavailable');
  return body.orders.some(order => matchesPurchase(order, productId, orderNumber, email));
}