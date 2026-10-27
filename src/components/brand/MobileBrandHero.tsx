import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProductReviews } from "@/hooks/useProductReviews";

/** Mobile-only homepage; shares the approved review query with product pages. */
export default function MobileBrandHero() {
  const { stats, isSuccess } = useProductReviews();
  const navigate = useNavigate();

  const openReviews = () => {
    const section = document.getElementById("bewertungen");
    if (section) section.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    else navigate("/reviews");
  };

  return (
    <section className="mobile-brand-hero" aria-labelledby="mobile-brand-title">
      <img className="mobile-brand-hero-image" src="/assets/hero/mobile-laptop.webp"
        alt="RAJ NEXUS Ladestation neben einem Laptop" width={828} height={1472}
        fetchPriority="high" loading="eager" decoding="async" />
      <div className="mobile-brand-hero-shade" aria-hidden="true" />
      <div className="mobile-brand-hero-content">
        <p className="mobile-brand-hero-eyebrow">A SWISS BRAND</p>
        <h1 id="mobile-brand-title" className="mobile-brand-hero-title">
          <span className="block">Energie,</span>
          <span className="mobile-brand-hero-metal font-serif italic font-light block">in Form gegossen.</span>
        </h1>
        <p className="mobile-brand-hero-description">Apple-Zubehör einer Schweizer Marke. Geliefert in 1–2 Werktagen.</p>
        <div className="mobile-brand-hero-actions">
          <Button asChild className="mobile-hero-primary"><Link to="/nexus">NEXUS entdecken</Link></Button>
          <Button asChild variant="outline" className="mobile-hero-outline"><Link to="/produkte">Alle Produkte</Link></Button>
        </div>
        {isSuccess && stats.total > 0 && (
          <Button variant="link" className="mobile-brand-hero-rating" onClick={openReviews}>
            <span className="mobile-brand-hero-stars" aria-hidden="true">★★★★★</span>
            <span>{stats.average.toFixed(1)} · {stats.total} Bewertungen</span>
          </Button>
        )}
      </div>
    </section>
  );
}