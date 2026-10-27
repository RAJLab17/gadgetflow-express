import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Smartphone, Watch, CarFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { observeMediaQuery } from "@/lib/mediaQuery";
import { CHARGE_END, chargingPercent, claimChargingMoment } from "./chargingMoment";

function AirPodsIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    <path d="M7 3a4 4 0 0 0-4 4c0 2 1.5 3.5 3.5 3.5V20a1.5 1.5 0 0 0 3 0V6A3 3 0 0 0 7 3ZM17 3a4 4 0 0 1 4 4c0 2-1.5 3.5-3.5 3.5V20a1.5 1.5 0 0 1-3 0V6A3 3 0 0 1 17 3Z" />
    <path d="M5.5 6.5h1M17.5 6.5h1" />
  </svg>;
}

function ChargingMomentContent() {
  const ref = useRef<HTMLElement>(null);
  const gradientId = `charge-${useId().replace(/:/g, "")}`;
  const [percent, setPercent] = useState([0, 0, 0]);
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    let frame = 0;
    let started = false;
    let cancelled = false;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stopMotion = () => {
      setReduced(motion.matches);
      if (motion.matches) {
        cancelAnimationFrame(frame);
        setPercent([100, 100, 100]);
        setAnimate(false);
      }
    };
    const unsubscribe = observeMediaQuery(motion, stopMotion);
    const start = () => {
      if (started) return;
      started = true;
      let storage: Storage | undefined;
      try { storage = window.sessionStorage; } catch { /* Memory fallback. */ }
      const first = claimChargingMoment(storage);
      if (!first || motion.matches) {
        setPercent([100, 100, 100]);
        return;
      }
      setAnimate(true);
      const beginning = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const elapsed = now - beginning;
        setPercent([0, 1, 2].map(index => chargingPercent(elapsed, index)));
        if (elapsed < CHARGE_END) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        start();
        observer?.disconnect();
      }
    }, { threshold: 0.25 });
    if (observer) observer.observe(section);
    else start();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      unsubscribe();
    };
  }, []);

  const icons = [Smartphone, Watch, AirPodsIcon];
  const values = reduced ? [100, 100, 100] : percent;
  return (
    <section ref={ref} className="mobile-charging-moment" aria-labelledby="charging-moment-title">
      <p className="charging-eyebrow">DAS RAJ ECOSYSTEM</p>
      <div className="charging-devices" role="img" aria-label="RAJ NEXUS lädt iPhone, Apple Watch und AirPods">
        {icons.map((Icon, index) => (
          <div key={index} className={`charging-ring ${animate && values[index] === 100 ? "charging-ring-complete" : ""}`}>
            <svg className="charging-ring-track" viewBox="0 0 80 80" aria-hidden="true">
              <defs><linearGradient id={`${gradientId}-${index}`} x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" className="charging-gold-start" /><stop offset="100%" className="charging-gold-end" />
              </linearGradient></defs>
              <circle className="charging-track" cx="40" cy="40" r="37" />
              <circle className="charging-progress" cx="40" cy="40" r="37" pathLength="100" stroke={`url(#${gradientId}-${index})`} strokeDasharray="100" strokeDashoffset={100 - (values[index] ?? 0)} transform="rotate(-90 40 40)" />
            </svg>
            <div className="charging-ring-content"><Icon /><span>{values[index]}%</span></div>
          </div>
        ))}
      </div>
      <p className="charging-product-name">RAJ NEXUS</p>
      <div className="charging-divider" aria-hidden="true" />
      <div className="charging-apex">
        <div className="charging-ring charging-ring-apex">
          <svg className="charging-ring-track" viewBox="0 0 80 80" aria-hidden="true">
            <circle className="charging-track" cx="40" cy="40" r="37" />
            <circle className="charging-apex-shimmer" cx="40" cy="40" r="37" pathLength="100" />
          </svg>
          <div className="charging-ring-content"><CarFront strokeWidth={1.2} /><span>BALD</span></div>
        </div>
        <p className="charging-product-name">RAJ APEX</p>
        <p className="charging-apex-description">Kabelloses Laden im Auto</p>
      </div>
      <h2 id="charging-moment-title" className="charging-moment-title">Zuhause, im Büro und bald unterwegs.</h2>
      <div className="charging-links">
        <Button asChild variant="link"><Link to="/nexus">NEXUS entdecken <span aria-hidden="true">→</span></Link></Button>
        <Button asChild variant="link"><Link to="/apex">APEX vormerken <span aria-hidden="true">→</span></Link></Button>
      </div>
    </section>
  );
}

export default function MobileChargingMoment() {
  return useIsMobile() ? <ChargingMomentContent /> : null;
}