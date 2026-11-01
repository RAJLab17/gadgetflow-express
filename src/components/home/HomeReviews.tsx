import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProductReviews } from "@/hooks/useProductReviews";
import { selectHomeReviews, homeReviewExcerpt, reviewSourceLabel } from "@/lib/homeReviews";
import { reviewFirstName } from "@/lib/reviewHighlights";
import { observeMediaQuery } from "@/lib/mediaQuery";
import HomeSection from "./HomeSection";
import "@/styles/home-social.css";

const PRODUCT_NAMES: Record<string, string> = { nexus: "RAJ NEXUS", matrix: "RAJ MATRIX", "airpods-case": "AirPods-Hülle" };
export default function HomeReviews() {
  const { reviews, stats } = useProductReviews();
  const slides = useMemo(() => selectHomeReviews(reviews), [reviews]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [cycle, setCycle] = useState(0);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(!document.hidden);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = Math.max(0, slides.findIndex(r => r.id === activeId));
  const running = inView && tabVisible && !reduced;
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    return observeMediaQuery(query, () => setReduced(query.matches));
  }, []);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const listener = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", listener);
    return () => document.removeEventListener("visibilitychange", listener);
  }, []);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false), { threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [slides.length > 0]);
  useEffect(() => {
    if (!running || slides.length < 2) return;
    const interval = window.setInterval(() => { setActiveId(slides[(active + 1) % slides.length]?.id ?? null); setCycle(value => value + 1); }, 5000);
    return () => window.clearInterval(interval);
  }, [running, slides, active, cycle]);
  if (!slides.length) return null;
  return <HomeSection tone="ivory" id="bewertungen" className="home-reviews">
    <div ref={ref} className="home-reviews-layout">
      <div className="home-reviews-line" aria-hidden="true" />
      <h2 className="home-reviews-heading">{stats.average.toFixed(1)} AUS {stats.total} BEWERTUNGEN</h2>
      <div className="home-reviews-stage">
        {slides.map((review, index) => <article key={review.id} aria-hidden={active !== index} className={`home-review-slide ${review.photo_url ? "has-photo" : ""} ${active === index ? "is-active" : index === (active + slides.length - 1) % slides.length ? "is-leaving" : ""}`}>
          {review.photo_url && <img className="home-review-photo" src={review.photo_url} alt={`Kundenfoto von ${reviewFirstName(review.customer_name)} zu ${PRODUCT_NAMES[review.product_id] ?? "RAJ"}`} loading="lazy" decoding="async" width={520} height={380} />}
          <div className="home-review-copy"><div className="home-review-stars" aria-label="5 von 5 Sternen">★★★★★</div><blockquote className="home-review-quote">«{homeReviewExcerpt(review.comment)}»</blockquote><p className="home-review-person">{reviewFirstName(review.customer_name)} · {PRODUCT_NAMES[review.product_id] ?? "RAJ"}{reviewSourceLabel(review) && <span> · {reviewSourceLabel(review)}</span>}</p></div>
        </article>)}
      </div>
      <div className={`home-review-bars ${running ? "" : "is-paused"}`}>{slides.map((review, index) => <Button key={`${review.id}-${cycle}`} variant="ghost" className={`home-review-bar ${index === active ? "is-active" : ""}`} aria-label={`Bewertung ${index + 1} von ${slides.length}`} aria-pressed={index === active} onClick={() => { setActiveId(review.id); setCycle(value => value + 1); }}><span className="home-review-bar-track"><span className="home-review-bar-fill" /></span></Button>)}</div>
      <Button asChild variant="link" className="home-reviews-link"><Link to="/reviews">Alle Bewertungen lesen</Link></Button>
    </div>
  </HomeSection>;
}