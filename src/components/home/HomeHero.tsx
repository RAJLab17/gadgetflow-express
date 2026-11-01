import { Link } from "react-router-dom";
import { useProductReviews } from "@/hooks/useProductReviews";
import onyx from "@/assets/matrix/uploaded-renders/18-onyx-darkgrey-v2-full.webp.asset.json";
import cherry from "@/assets/matrix/uploaded-renders/18-cherry-darkcherry-norm-full.webp.asset.json";
import nexus524 from "@/assets/home/raj-nexus-hero-cutout-524.webp";
import nexus760 from "@/assets/home/raj-nexus-hero-cutout-760.webp";
import apexCar from "@/assets/home/objekt-apex-correct.jpg";
import "@/styles/home-hero.css";

/**
 * HomeHero (Etappe 2): 3-Slide-Bühne (MATRIX → NEXUS → APEX, 15s Zyklus)
 * über dem Textblock. Ersetzt BrandHero; die alte Datei bleibt erhalten.
 */
const HomeHero = () => {
  const { stats, isSuccess } = useProductReviews();

  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      {/* Bühne */}
      <div className="hh-stage">
        <div className="hh-glow" aria-hidden="true" />

        {/* Slide 1: MATRIX */}
        <div className="hh-slide hh-slide--matrix">
          <span className="hh-case hh-case--cherry">
            <img
              src={cherry.url}
              alt="RAJ MATRIX Hülle in Cherry Carbon"
              width={600}
              height={600}
              fetchPriority="high"
              decoding="async"
            />
          </span>
          <span className="hh-case hh-case--onyx">
            <img
              src={onyx.url}
              alt="RAJ MATRIX Hülle in Onyx Carbon"
              width={600}
              height={600}
              loading="lazy"
              decoding="async"
            />
          </span>
        </div>

        {/* Slide 2: NEXUS */}
        <div className="hh-slide hh-slide--nexus">
          <div className="hh-nexus">
            <img
              className="hh-nexus-img"
              src={nexus760}
              srcSet={`${nexus524} 524w, ${nexus760} 760w`}
              sizes="(max-width: 1023px) 262px, 380px"
              alt="RAJ NEXUS lädt iPhone, AirPods und Apple Watch"
              width={760}
              height={861}
              loading="lazy"
              decoding="async"
            />
            <div className="hh-nexus-floor" aria-hidden="true" />
            <img
              className="hh-nexus-reflect"
              src={nexus524}
              alt=""
              aria-hidden="true"
              width={524}
              height={593}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="hh-pill">
            <span className="hh-ring" aria-hidden="true">
              <span className="hh-ring-num" />
            </span>
            <span className="hh-pill-lines">
              <span className="hh-pill-title">Bis zu 25 W</span>
              <span className="hh-pill-sub">Qi2.2 · drei Geräte</span>
            </span>
          </div>
        </div>

        {/* Slide 3: APEX */}
        <div className="hh-slide hh-slide--apex">
          <div className="hh-apex">
            <img
              src={apexCar}
              alt="RAJ APEX Auto-Ladehalterung im Fahrzeug"
              width={896}
              height={1200}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>

      {/* Produktzeile + Fortschrittsbalken */}
      <div className="hh-meta">
        <div className="hh-products">
          <p className="hh-product hh-product--matrix">
            <span className="hh-pname">RAJ MATRIX</span>HÜLLE · AB CHF 59.–
          </p>
          <p className="hh-product hh-product--nexus">
            <span className="hh-pname">RAJ NEXUS</span>3-IN-1 · CHF 99.–
          </p>
          <p className="hh-product hh-product--apex">
            <span className="hh-pname">RAJ APEX</span>FÜRS AUTO · BALD
          </p>
        </div>
        <div className="hh-bars" aria-hidden="true">
          <span className="hh-bar"><span className="hh-fill hh-fill--matrix" /></span>
          <span className="hh-bar"><span className="hh-fill hh-fill--nexus" /></span>
          <span className="hh-bar"><span className="hh-fill hh-fill--apex" /></span>
        </div>
      </div>

      {/* Textblock */}
      <div className="hh-text">
        <p className="hh-eyebrow">Schweizer Marke · Weinfelden</p>
        <h1 id="home-hero-title" className="hh-title">
          <span className="hh-title-line1">Energie,</span>
          <span className="hh-title-line2">in Form gegossen.</span>
        </h1>
        <p className="hh-lead">
          3-in-1 Ladestation und MagSafe-Hüllen für dein iPhone. Versand in 2–3 Werktagen, 30 Tage Rückgabe.
        </p>
        <p className="hh-rating">
          {isSuccess && stats.total > 0 && (
            <Link to="/reviews">
              <span className="hh-stars" aria-hidden="true">★★★★★</span>
              {stats.average.toFixed(1)} · {stats.total} {stats.total === 1 ? "Bewertung" : "Bewertungen"}
            </Link>
          )}
        </p>
        <div className="hh-buttons">
          <Link to="/nexus" className="hh-btn hh-btn--nexus">
            <span className="hh-btn-name">NEXUS</span>
            <span className="hh-btn-price">CHF 99.–</span>
          </Link>
          <Link to="/matrix" className="hh-btn hh-btn--matrix">
            <span className="hh-btn-name">MATRIX</span>
            <span className="hh-btn-price">CHF 59.–</span>
          </Link>
        </div>
        <div className="hh-scroll" aria-hidden="true" />
      </div>
    </section>
  );
};

export default HomeHero;
