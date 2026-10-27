import { Link } from "react-router-dom";
import { useProductReviews } from "@/hooks/useProductReviews";
import BrandNextDrop from "./BrandNextDrop";

/** Mobile-only homepage hero: compact title, live approved rating total and the collection carousel. */
export default function MobileBrandHero() {
  const { stats, isSuccess } = useProductReviews();

  return (
    <section className="mobile-brand-hero" aria-labelledby="mobile-brand-title">
      <div className="mobile-brand-hero-content">
        <h1 id="mobile-brand-title" className="mobile-brand-hero-title">
          <span className="block">Energie,</span>
          <span className="mobile-brand-hero-metal font-serif italic font-light block">in Form gegossen.</span>
        </h1>
        <p className="mobile-brand-hero-description">Apple-Zubehör einer Schweizer Marke. Geliefert in 1–2 Werktagen.</p>
        {isSuccess && stats.total > 0 && (
          <Link to="/reviews" className="mobile-brand-hero-rating items-center">
            <span className="mobile-brand-hero-stars" aria-hidden="true">★★★★★</span>
            <span>{stats.average.toFixed(1)} · {stats.total} Bewertungen</span>
          </Link>
        )}
      </div>
      <BrandNextDrop variant="carousel" />
    </section>
  );
}
