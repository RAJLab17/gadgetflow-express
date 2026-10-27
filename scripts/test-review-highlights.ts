import { test, expect } from 'bun:test';
import { reviewHighlights } from '../src/lib/reviewHighlights';
import type { PublicReview } from '../src/components/reviews/ReviewCard';

const review = (id: number, product_id = 'matrix', rating = 5, photo = true): PublicReview => ({
  id: String(id), product_id, rating, photo_url: photo ? `/test-only/${id}.jpg` : null,
  title: 'Test fixture', comment: 'Not published', customer_name: 'Fixture', verified_purchase: false,
  helpful_count: 0, founder_response: null, founder_responded_at: null, created_at: new Date(2026, 0, id).toISOString(),
});
test('maximum four customer thumbnails and exact overflow count', () => {
  const result = reviewHighlights(Array.from({ length: 7 }, (_, i) => review(i + 1)), 'matrix');
  expect(result.visiblePhotos.map(r => r.id)).toEqual(['7', '6', '5', '4']);
  expect(result.extraPhotos).toBe(3);
});
test('filters and sorting start at exactly ten own reviews', () => {
  const nine = Array.from({ length: 9 }, (_, i) => review(i + 1));
  expect(reviewHighlights([...nine, review(20, 'nexus')], 'matrix').showControls).toBe(false);
  expect(reviewHighlights([...nine, review(10)], 'matrix').showControls).toBe(true);
});
test('customer photos come only from the selected product', () => {
  const result = reviewHighlights([review(4), review(9, 'matrix', 4), review(7), review(12, 'nexus')], 'matrix');
  expect(result.photos.some(r => r.product_id !== 'matrix')).toBe(false);
});
test('no matching photos produces no customer photo strip', () => {
  const result = reviewHighlights([review(1, 'airpods-case', 4, false), review(2, 'nexus')], 'airpods-case');
  expect(result.photos).toEqual([]);
  expect(result.extraPhotos).toBe(0);
});