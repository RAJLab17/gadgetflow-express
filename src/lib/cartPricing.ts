export interface CartMoney {
  amount: string;
  currencyCode: string;
}

export interface CartDiscount {
  title?: string;
  code?: string;
  discountedAmount: CartMoney;
}

export interface CartLineCost {
  id: string;
  quantity: number;
  cost: { totalAmount: CartMoney; subtotalAmount: CartMoney };
  discountAllocations: CartDiscount[];
  merchandise: { id: string };
}

const toCents = (amount: string) => Math.round(Number(amount) * 100);
const fromCents = (cents: number) => (cents / 100).toFixed(2);

export function groupCartDiscounts(allocations: readonly CartDiscount[]) {
  const groups = new Map<string, { title: string; cents: number; currencyCode: string }>();

  for (const { title, code, discountedAmount } of allocations) {
    const cents = toCents(discountedAmount.amount);
    if (!Number.isFinite(cents) || cents <= 0) continue;

    const label = title || code || 'Rabatt';
    const { currencyCode } = discountedAmount;
    const key = `${currencyCode}:${label}`;
    const group = groups.get(key);
    if (group) group.cents += cents;
    else groups.set(key, { title: label, cents, currencyCode });
  }

  return Array.from(groups, ([key, { title, cents, currencyCode }]) => ({
    key, title, amount: fromCents(cents), currencyCode,
  }));
}

export function getCartLinePricing(lines: readonly CartLineCost[], productHandle: string) {
  const first = lines[0];
  if (!first) return null;

  // Shopify can split a variant into multiple lines to discount individual units.
  const total = lines.reduce((sum, line) => sum + toCents(line.cost.totalAmount.amount), 0);
  const subtotal = lines.reduce((sum, line) => sum + toCents(line.cost.subtotalAmount.amount), 0);
  const discounts = groupCartDiscounts(lines.flatMap(line => line.discountAllocations));
  const freeAirPodsCase = total === 0 && productHandle.includes('airpods');

  return {
    total: { amount: fromCents(total), currencyCode: first.cost.totalAmount.currencyCode },
    beforeDiscount: subtotal > total ? { amount: fromCents(subtotal), currencyCode: first.cost.subtotalAmount.currencyCode } : null,
    discounts: freeAirPodsCase ? discounts.map(discount => ({ ...discount, title: 'AirPods Case gratis' })) : discounts,
  };
}

export function cartLineUpdates(lineIds: readonly string[], quantity: number) {
  return lineIds.map((id, index) => ({ id, quantity: index === 0 ? quantity : 0 }));
}