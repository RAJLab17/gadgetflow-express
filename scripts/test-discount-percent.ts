import { expect, test } from 'bun:test';
import { discountPercent } from '../src/lib/livePrice';

const product = (price: string, comparison?: string) => ({ price: { amount: price }, compareAtPrice: comparison ? { amount: comparison } : null });

test('NEXUS CHF 89/99 rounds down to 10 percent', () => {
  expect(discountPercent(product('89', '99'))).toBe(10);
});
test('MATRIX CHF 49/59 rounds down to 16 percent, never 17', () => {
  expect(discountPercent(product('49', '59'))).toBe(16);
});
test('AirPods CHF 35 without compareAtPrice has no percentage', () => {
  expect(discountPercent(product('35'))).toBeNull();
});
test('percentages below 5 are hidden, exactly 5 is visible', () => {
  expect(discountPercent(product('95.01', '100'))).toBeNull();
  expect(discountPercent(product('95', '100'))).toBe(5);
});
test('removing the MATRIX comparison price automatically removes the percentage', () => {
  const matrix = product('49', '59');
  expect(discountPercent(matrix)).toBe(16);
  matrix.compareAtPrice = null;
  expect(discountPercent(matrix)).toBeNull();
});
test('loading, invalid, equal or lower comparison prices have no percentage', () => {
  for (const value of [undefined, product('49', '49'), product('49', '39'), product('NaN', '59'), product('49', 'Infinity')]) {
    expect(discountPercent(value)).toBeNull();
  }
});