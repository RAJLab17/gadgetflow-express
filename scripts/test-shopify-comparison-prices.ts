import { expect, test } from 'bun:test';
import { comparisonAmount, pricePerUnit, regularPriceTotal } from '../src/lib/livePrice';

const variant = (price: string, compareAtPrice?: string) => ({ price: { amount: price }, compareAtPrice: compareAtPrice ? { amount: compareAtPrice } : null });

test('MATRIX at CHF 49 displays its CHF 59 Shopify comparison price', () => {
  expect(comparisonAmount(variant('49', '59'))).toBe(59);
});

test('a missing or non-higher Shopify comparison never produces a comparison price', () => {
  expect([comparisonAmount(variant('35')), comparisonAmount(variant('49', '49')), comparisonAmount(variant('49', '39'))]).toEqual([null, null, null]);
});

test('the Black Week trio has a CHF 193 regular-price reference from 99 + 59 + 35', () => {
  expect(regularPriceTotal([variant('89', '99'), variant('49', '59'), variant('35')])).toBe(193);
});

test('two NEXUS at the CHF 158 Shopify quote display CHF 79 per piece', () => {
  expect(pricePerUnit(158, 2)).toBe(79);
  expect(pricePerUnit(null, 2)).toBeNull();
});