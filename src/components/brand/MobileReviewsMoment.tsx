import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProductReviews } from "@/hooks/useProductReviews";
import type { PublicReview } from "@/components/reviews/ReviewCard";

const NAMES: Record<string, string> = { nexus: "RAJ NEXUS", matrix: "RAJ MATRIX" };

/** Interleaves the newest approved NEXUS and MATRIX reviews (max. 6). */
export function pickHomeReviews(reviews: PublicReview[], max = 6): PublicReview[] {
  const good = (id: string) => reviews.filter(r => r.product_id === id && r.rating >= 4 && r.comment?.trim());
  const nexus = good("nexus");
  const matrix = good("matrix");
  const out: PublicReview[] = [];
  for (let i = 0; out.length < max && (i < nexus.length || i < matrix.length); i++) {
    if (matrix[i]) out.push(matrix[i]);
    if (out.length < max && nexus[i]) out.push(nexus[i]);
  }
  return out;
}

const shorten = (text: string) => (text.length > 150 ? `${text.slice(0, 147).trimEnd()}…` : text);

function ReviewsContent() {
  const { reviews, isSuccess } = useProductReviews();
  const picks = pickHomeReviews(reviews);
  if (!isSuccess || picks.length < 3) return null;

  return (
    <section className="mobile-reviews-moment" aria-labelledby="mobile-reviews-title">
      <p className="charging-eyebrow">Bewertungen</p>
      <h2 id="mobile-reviews-title" className="mobile-reviews-title">Was Kunden sagen</h2>
      <div className="mobile-reviews-track mobile-collection-track">
        {picks.map(r => (
          <article key={r.id} className="mobile-review-card">
            {r.photo_url && <img src={r.photo_url} alt={`Kundenfoto zu ${NAMES[r.product_id]}`} loading="lazy" decoding="async" className="mobile-review-photo" />}
            <p className="mobile-review-product">{NAMES[r.product_id]}</p>
            <p className="mobile-review-stars" aria-label={`${r.rating} von 5 Sternen`}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
            <p className="mobile-review-text">«{shorten(r.comment.trim())}»</p>
            <p className="mobile-review-name">{r.customer_name.trim().split(/\s+/)[0]}</p>
          </article>
        ))}
      </div>
      <Link to="/reviews" className="mobile-reviews-link">Alle Bewertungen <span aria-hidden="true">→</span></Link>
    </section>
  );
}

export default function MobileReviewsMoment() {
  return useIsMobile() ? <ReviewsContent /> : null;
}
