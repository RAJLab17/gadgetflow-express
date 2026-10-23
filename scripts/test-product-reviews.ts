import { test, expect } from 'bun:test';
import { isReviewProduct, reviewSchema } from '../src/lib/reviewProducts';
import { matchesPurchase, verifyPurchase } from '../supabase/functions/submit-review/verify-purchase';

const order = { name: '#1234', email: 'buyer@example.invalid', financial_status: 'paid', cancelled_at: null,
  line_items: [{ product_id: 15693851623749, variant_id: 1, quantity: 1 }, { variant_id: 59116736676165, quantity: 1 }] };
test('exactly three product assignments', () => {
  expect(['nexus', 'matrix', 'airpods-case'].every(isReviewProduct)).toBe(true);
  expect(isReviewProduct('other')).toBe(false); expect(isReviewProduct('toString')).toBe(false);
});
test('matching email and MATRIX product verifies', () => expect(matchesPurchase(order, 'matrix', 'BUYER@example.invalid')).toBe(true));
test('matching NEXUS product verifies', () => expect(matchesPurchase(order, 'nexus', 'buyer@example.invalid')).toBe(true));
test('MATRIX order never verifies AirPods', () => expect(matchesPurchase(order, 'airpods-case', 'buyer@example.invalid')).toBe(false));
test('AirPods exact variant verifies', () => expect(matchesPurchase({ ...order, line_items: [{ variant_id: 59116737364293, quantity: 1 }] }, 'airpods-case', 'buyer@example.invalid')).toBe(true));
test('wrong email never verifies', () => expect(matchesPurchase(order, 'matrix', 'wrong@example.invalid')).toBe(false));
test('cancelled order never verifies', () => expect(matchesPurchase({ ...order, cancelled_at: '2026-10-22' }, 'matrix', 'buyer@example.invalid')).toBe(false));
test('unpaid order never verifies', () => expect(matchesPurchase({ ...order, financial_status: 'pending' }, 'matrix', 'buyer@example.invalid')).toBe(false));
test('empty email never verifies', async () => expect(await verifyPurchase('matrix', '', undefined)).toBe(false));
test('missing Shopify access fails closed', async () => expect(verifyPurchase('matrix', 'buyer@example.invalid', undefined)).rejects.toThrow('verification_unavailable'));
test('empty product schema omits ratings', () => expect(reviewSchema('matrix', [])).toEqual({}));
test('NEXUS reviews cannot enter MATRIX schema', () => {
  const reviews = [{ product_id: 'nexus', rating: 5, customer_name: 'Unit test', created_at: '2026-10-22', comment: 'Test fixture only', title: 'Test' }];
  expect(reviewSchema('matrix', reviews)).toEqual({});
  expect(reviewSchema('nexus', reviews).aggregateRating?.reviewCount).toBe(1);
});