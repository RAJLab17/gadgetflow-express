import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useProductReviews } from "@/hooks/useProductReviews";
import { reviewFirstName, reviewHighlights } from "@/lib/reviewHighlights";
import type { ReviewProductId } from "@/lib/reviewProducts";
import type { PublicReview } from "./ReviewCard";
import ReviewPhotoLightbox from "./ReviewPhotoLightbox";

export function ProductCustomerPhotos({ productId }: { productId: ReviewProductId }) {
  const { reviews } = useProductReviews(productId);
  const { photos, visiblePhotos, extraPhotos } = reviewHighlights(reviews, productId);
  const [selected, setSelected] = useState<PublicReview | null>(null);
  if (!photos.length) return null;
  return <div className="mt-2 flex flex-wrap items-center gap-2" aria-label="Kundenfotos">
    <span className="text-xs text-foreground">Kundenfotos</span>
    {visiblePhotos.map(review => <Button key={review.id} type="button" variant="outline" onClick={() => setSelected(review)} aria-label={`Kundenfoto von ${reviewFirstName(review.customer_name)} öffnen`} className="h-12 w-12 shrink-0 overflow-hidden rounded-md p-0">
      <img src={review.photo_url ?? undefined} alt={`Kundenfoto von ${reviewFirstName(review.customer_name)}`} width={48} height={48} loading="lazy" decoding="async" className="h-full w-full object-cover" />
    </Button>)}
    {extraPhotos > 0 && <Button type="button" variant="outline" aria-label={`${extraPhotos} weitere Kundenfotos`} onClick={() => setSelected(photos[4] ?? null)} className="h-12 w-12 shrink-0 rounded-md p-0 text-xs">+{extraPhotos}</Button>}
    <ReviewPhotoLightbox review={selected} onClose={() => setSelected(null)} />
  </div>;
}

export function ProductReviewQuote({ productId }: { productId: ReviewProductId }) {
  const { reviews } = useProductReviews(productId);
  const { quote } = reviewHighlights(reviews, productId);
  if (!quote) return null;
  return <p className="mt-2 min-w-0 truncate text-xs italic text-foreground" title={`«${quote.title}» – ${reviewFirstName(quote.customer_name)}${quote.verified_purchase ? ", verifizierter Kauf" : ""}`}>
    «{quote.title}» – {reviewFirstName(quote.customer_name)}{quote.verified_purchase ? ", verifizierter Kauf" : ""}
  </p>;
}