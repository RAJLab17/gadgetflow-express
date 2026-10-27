import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProductReviews } from "@/hooks/useProductReviews";
import onyx from "@/assets/matrix/uploaded-renders/18-onyx-darkgrey-v2-mobile.webp.asset.json";
import cherry from "@/assets/matrix/uploaded-renders/18-cherry-darkcherry-norm-mobile.webp.asset.json";

const POINTS = [
  "Carbon-Look mit goldenen Aluminium-Knöpfen",
  "MagSafe: hält sicher am RAJ NEXUS",
  "Passt auf iPhone 17 Pro bis 18 Pro Max",
];

function MatrixMomentContent() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { stats, isSuccess } = useProductReviews("matrix");

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") { setVisible(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="mobile-matrix-moment" aria-labelledby="matrix-moment-title">
      <p className="charging-eyebrow">RAJ MATRIX</p>
      <h2 id="matrix-moment-title" className="matrix-moment-title">
        Die Hülle als <span className="font-serif italic">Teil des Systems.</span>
      </h2>
      <div ref={ref} className={`matrix-moment-cases ${visible ? "is-visible" : ""}`}>
        <img className="matrix-case-back" src={cherry.url} alt="RAJ MATRIX Hülle Cherry Carbon mit iPhone 18 Pro in Dark Cherry" width={600} height={600} loading="lazy" decoding="async" />
        <img className="matrix-case-front" src={onyx.url} alt="RAJ MATRIX Hülle Onyx Carbon mit iPhone 18 Pro in Dark Grey" width={600} height={600} loading="lazy" decoding="async" />
      </div>
      <ul className="matrix-moment-points">
        {POINTS.map(p => <li key={p}><Check aria-hidden="true" strokeWidth={1.4} />{p}</li>)}
      </ul>
      <p className="matrix-moment-price">ab CHF 59.–</p>
      {isSuccess && stats.total > 0 && (
        <p className="matrix-moment-rating">
          <span aria-hidden="true">★★★★★</span> {stats.average.toFixed(1)} · {stats.total} {stats.total === 1 ? "Bewertung" : "Bewertungen"}
        </p>
      )}
      <Button asChild className="matrix-moment-button"><Link to="/matrix">MATRIX ansehen <span aria-hidden="true">→</span></Link></Button>
    </section>
  );
}

export default function MobileMatrixMoment() {
  return useIsMobile() ? <MatrixMomentContent /> : null;
}
