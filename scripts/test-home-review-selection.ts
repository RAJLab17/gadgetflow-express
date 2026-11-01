import { test, expect } from 'bun:test';
import { homeReviewExcerpt, selectHomeReviews, reviewSourceLabel } from '../src/lib/homeReviews';
import type { PublicReview } from '../src/components/reviews/ReviewCard';
const r = (id: number, extra: Partial<PublicReview> = {}): PublicReview => ({ id: String(id), product_id: 'matrix', customer_name: 'Fixture Only', rating: 5, title: 'Fixture', comment: 'a'.repeat(40), verified_purchase: false, helpful_count: 0, founder_response: null, founder_responded_at: null, created_at: new Date(2026, 0, id).toISOString(), source: 'raj', ...extra });
test('requires five stars and at least forty characters', () => {
  const picked = selectHomeReviews([r(1), r(2), r(3), r(4, {rating: 4}), r(5, {comment: 'a'.repeat(39)})]);
  expect(picked.map(x=>x.id)).toEqual(['3','2','1']);
});
test('hides with fewer than three qualifying reviews', () => expect(selectHomeReviews([r(1),r(2)])).toEqual([]));
test('featured first, photos second, latest third, maximum six', () => {
  const picked=selectHomeReviews([r(1,{featured_home:true}),r(2,{photo_url:'/fixture.jpg'}),r(3),r(4),r(5),r(6),r(7),r(8)]);
  expect(picked.map(x=>x.id)).toEqual(['1','2','8','7','6','5']);
});
test('keeps a 140-character comment unchanged',()=>expect(homeReviewExcerpt('a'.repeat(140))).toBe('a'.repeat(140)));
test('truncates at the final word boundary below 140',()=>expect(homeReviewExcerpt('word '.repeat(30))).toBe('word '.repeat(27)+'word…'));
test('Google can never display a verified label',()=>expect(reviewSourceLabel({source:'google',verified_purchase:true})).toBe('Google-Bewertung'));