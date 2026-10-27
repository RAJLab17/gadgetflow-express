import type { PublicReview } from "@/components/reviews/ReviewCard";
import type { ReviewProductId } from "./reviewProducts";

/** Input comes from the approved-only public review query. */
export function reviewHighlights(reviews: PublicReview[], productId: ReviewProductId) {
  const own = reviews.filter(review => review.product_id === productId)
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  const photos = own.filter(review => Boolean(review.photo_url));
  return {
    photos,
    visiblePhotos: photos.slice(0, 4),
    extraPhotos: Math.max(0, photos.length - 4),
    showControls: own.length >= 10,
  };
}

export const reviewFirstName = (name: string) => name.trim().split(/\s+/)[0] || name;