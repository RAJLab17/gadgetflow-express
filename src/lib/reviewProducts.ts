export const REVIEW_PRODUCTS = {
  nexus: "RAJ NEXUS",
  matrix: "RAJ MATRIX",
  "airpods-case": "RAJ MATRIX AirPods Case",
} as const;
export type ReviewProductId = keyof typeof REVIEW_PRODUCTS;
export function isReviewProduct(value: unknown): value is ReviewProductId {
  return typeof value === "string" && Object.hasOwn(REVIEW_PRODUCTS, value);
}
export function reviewSchema(productId: ReviewProductId, reviews: Array<{ product_id: string; rating: number; customer_name: string; created_at: string; comment: string; title: string }>) {
  const own = reviews.filter((review) => review.product_id === productId);
  if (!own.length) return {};
  return {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number((own.reduce((sum, review) => sum + review.rating, 0) / own.length).toFixed(2)),
      reviewCount: own.length, bestRating: 5, worstRating: 1,
    },
    review: own.slice(0, 10).map((review) => ({
      "@type": "Review", author: { "@type": "Person", name: review.customer_name },
      datePublished: review.created_at, reviewBody: review.comment, name: review.title,
      reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5, worstRating: 1 },
    })),
  };
}