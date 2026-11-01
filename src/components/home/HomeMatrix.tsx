import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductReviews } from "@/hooks/useProductReviews";
import HomeSection from "./HomeSection";
import onyx from "@/assets/matrix/uploaded-renders/18-onyx-darkgrey-v2-full.webp.asset.json";
import cherry from "@/assets/matrix/uploaded-renders/18-cherry-darkcherry-norm-full.webp.asset.json";
import "@/styles/home-products.css";

const POINTS = [
  "Carbon-Design mit goldenen Aluminium-Knöpfen",
  "MagSafe-kompatibel: hält sicher am RAJ NEXUS",
  "Passt auf iPhone 17 Pro bis 18 Pro Max",
];

export default function HomeMatrix() {
  const ref = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);
  const { stats, isSuccess } = useProductReviews("matrix");
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") { setVisible(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <HomeSection tone="white" id="matrix" className="home-matrix">
      <p className="home-product-eyebrow">RAJ MATRIX</p>
      <h2 className="home-matrix-title">Die Hülle als <span className="home-matrix-title-accent">Teil des <span className="home-matrix-title-last">Systems.</span></span></h2>
      <Link ref={ref} to="/matrix" aria-label="RAJ MATRIX ansehen" className={`home-matrix-cases ${visible ? "is-visible" : "is-pending"}`}>
        <span className="home-matrix-case home-matrix-case-back"><img src={cherry.url} alt="RAJ MATRIX Hülle Cherry Carbon mit iPhone 18 Pro in Dark Cherry" width={600} height={750} loading="lazy" decoding="async" /></span>
        <span className="home-matrix-case home-matrix-case-front"><img src={onyx.url} alt="RAJ MATRIX Hülle Onyx Carbon mit iPhone 18 Pro in Dark Grey" width={600} height={750} loading="lazy" decoding="async" /></span>
      </Link>
      <ul className="home-matrix-points">{POINTS.map(point => <li key={point}><Check aria-hidden="true" strokeWidth={1.4} /><span>{point}</span></li>)}</ul>
      <p className="home-matrix-price">ab CHF 59.–</p>
      <p className="home-matrix-rating">
        {isSuccess && stats.total > 0 && <Link to="/reviews?product=matrix"><span className="home-matrix-stars" aria-hidden="true">★★★★★</span><span>{stats.average.toFixed(1)} · {stats.total} {stats.total === 1 ? "Bewertung" : "Bewertungen"}</span></Link>}
      </p>
      <Button asChild className="home-matrix-button"><Link to="/matrix">MATRIX ansehen <span aria-hidden="true">→</span></Link></Button>
    </HomeSection>
  );
}