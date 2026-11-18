import { expect, test } from 'bun:test';
import { cartLineUpdates, getCartLinePricing, groupCartDiscounts, type CartLineCost } from '../src/lib/cartPricing';

const money = (amount: string) => ({ amount, currencyCode: 'CHF' });
const allocation = (title: string, amount: string) => ({ title, discountedAmount: money(amount) });
const nexus = 'Black Week: 2. NEXUS CHF 20 günstiger';
const freeCase = 'Black Week: AirPods Case gratis zur MATRIX';
const line = (total: string, subtotal: string, discountAllocations: CartLineCost['discountAllocations'] = [], quantity = 1): CartLineCost => ({
  id: total, quantity, cost: { totalAmount: money(total), subtotalAmount: money(subtotal) }, discountAllocations, merchandise: { id: 'variant' },
});

test('one NEXUS costs CHF 89 without a crossed-out amount', () => {
  expect(getCartLinePricing([line('89', '89')], 'nexus')).toEqual({ total: money('89.00'), beforeDiscount: null, discounts: [] });
});

test('two split NEXUS lines show CHF 158 instead of CHF 178, with a CHF 20 discount', () => {
  const discountRows = getCartLinePricing([line('89', '89', [allocation(nexus, '0')]), line('69', '89', [allocation(nexus, '20')])], 'nexus');
  expect(discountRows).toMatchObject({ total: money('158.00'), beforeDiscount: money('178.00'), discounts: [{ title: nexus, amount: '20.00' }] });
});

test('allocations with equal titles are added, zero allocations are omitted, and other titles stay separate', () => {
  const groups = groupCartDiscounts([allocation(nexus, '0'), allocation(nexus, '8.30'), allocation('Nullrabatt', '0.00'), allocation(nexus, '11.70'), allocation('Andere Aktion', '3')]);
  expect(groups.map(({ title, amount }) => [title, amount])).toEqual([[nexus, '20.00'], ['Andere Aktion', '3.00']]);
});

test.each([['59', '35', 1], ['118', '70', 2]] as const)('MATRIX line CHF %s and free AirPods discount CHF %s', (matrix, airpods, quantity) => {
  expect(getCartLinePricing([line(matrix, matrix, [allocation(freeCase, '0')], quantity)], 'matrix')).toEqual({ total: money(`${matrix}.00`), beforeDiscount: null, discounts: [] });
  expect(getCartLinePricing([line('0', airpods, [allocation(freeCase, '0'), allocation(freeCase, airpods)], quantity)], 'matrix-airpods')).toMatchObject({
    total: money('0.00'), beforeDiscount: money(`${airpods}.00`), discounts: [{ title: 'AirPods Case gratis', amount: `${airpods}.00` }],
  });
});

test('changing the displayed NEXUS quantity replaces all Shopify split quantities', () => {
  expect(cartLineUpdates(['regular', 'discounted'], 2)).toEqual([{ id: 'regular', quantity: 2 }, { id: 'discounted', quantity: 0 }]);
});