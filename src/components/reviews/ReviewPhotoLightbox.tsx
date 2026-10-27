import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reviewFirstName } from "@/lib/reviewHighlights";
import type { PublicReview } from "./ReviewCard";
import StarRating from "./StarRating";

export default function ReviewPhotoLightbox({ review, onClose }: { review: PublicReview | null; onClose: () => void }) {
  useEffect(() => {
    if (!review?.photo_url) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = previous; };
  }, [review, onClose]);
  if (!review?.photo_url) return null;
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Foto-Vorschau" onClick={onClose} className="review-photo-overlay fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <Button autoFocus type="button" variant="ghost" size="icon" aria-label="Schliessen" onClick={onClose} className="review-photo-close absolute right-4 top-4 rounded-full"><X /></Button>
      <figure onClick={event => event.stopPropagation()} className="flex max-h-[90dvh] max-w-[95vw] flex-col items-center gap-3">
        <img src={review.photo_url} alt={`Foto zur Bewertung von ${reviewFirstName(review.customer_name)}`} className="max-h-[74dvh] max-w-full rounded-lg object-contain" />
        <figcaption className="review-photo-caption flex max-w-full flex-col items-center gap-1 text-center text-sm">
          <span>{reviewFirstName(review.customer_name)}</span>
          <StarRating value={review.rating} readOnly size={16} />
          <span className="break-words">{review.title}</span>
        </figcaption>
      </figure>
    </div>, document.body,
  );
}