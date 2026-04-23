import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import productHero from "@/assets/products/charger-3in1-hero.png";

const GOLD = "#9b6b3f";
const BEIGE = "#f0ede6";
const INK = "#2b2725";
const COPY = "#5a5550";

/**
 * Premium intro shown on every fresh page load.
 * Keeps the full product visible at all times and moves only the beige curtains.
 */
const IntroReveal = () => {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsMobile(window.matchMedia("(max-width: 640px)").matches);

    const params = new URLSearchParams(window.location.search);
    const enableDevMode = params.get("dev") === "1";

    if (enableDevMode) {
      localStorage.setItem("raj_dev_mode", "1");
    }

    setIsDev(localStorage.getItem("raj_dev_mode") === "1");
    setShow(true);
  }, []);

  const TOTAL = reduce ? 1000 : isMobile ? 4500 : 5200;
  const SWEEP = reduce ? 0.8 : isMobile ? 4.3 : 5.0;
  const TEXT_TIMES = [0, 0.15, 0.25, 0.85, 1];
  const SWEEP_TIMES = [0, 0.75, 1];

  const playIntro = useCallback(() => {
    setShow(true);
    setReplayKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t = window.setTimeout(() => {
      setShow(false);
      document.body.style.overflow = prev;
    }, TOTAL);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [show, TOTAL, replayKey]);

  useEffect(() => {
    (window as Window & { __rajReplayIntro?: () => void }).__rajReplayIntro = playIntro;
  }, [playIntro]);

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            key={`intro-${replayKey}`}
            className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ backgroundColor: BEIGE }}
          >
            <div className="absolute inset-0 flex flex-col">
              {/* Top half — text + upper part of product, slides up */}
              <motion.div
                className="relative flex-1 overflow-hidden will-change-transform"
                initial={{ y: 0 }}
                animate={{ y: reduce ? 0 : ["0%", "0%", "-100%"] }}
                transition={{
                  duration: SWEEP,
                  times: SWEEP_TIMES,
                  ease: [0.76, 0, 0.24, 1],
                }}
                style={{ backgroundColor: BEIGE }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: [0, 0, 1, 1, 0], y: [14, 14, 0, 0, -6] }}
                  transition={{
                    duration: SWEEP,
                    times: TEXT_TIMES,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute top-0 left-0 right-0 px-6 pt-16 text-center sm:pt-20"
                >
                  <p
                    className="mb-3 text-[9px] uppercase tracking-[0.35em] sm:text-xs"
                    style={{ color: GOLD }}
                  >
                    EST. 2026 · Switzerland
                  </p>
                  <h2
                    className="font-light tracking-tight"
                    style={{
                      color: INK,
                      fontFamily: "'Cormorant Garamond', 'Didot', 'Times New Roman', serif",
                      fontSize: "clamp(1.75rem, 9vw, 4.5rem)",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.05,
                    }}
                  >
                    Herzlich
                    <br />
                    <span style={{ color: GOLD, fontStyle: "italic" }}>Willkommen</span>
                  </h2>
                </motion.div>
                {/* Upper half of the product — integrated into the top composition */}
                <div
                  className="absolute left-1/2 bottom-0 -translate-x-1/2 overflow-hidden"
                  style={{
                    width: "min(72vw, 420px)",
                    height: "min(36vh, 260px)",
                  }}
                >
                  <img
                    src={productHero}
                    alt="RAJ NEXUS"
                    draggable={false}
                    className="absolute left-0 top-0 h-[200%] w-full object-contain object-top select-none"
                  />
                </div>
                <div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
                />
              </motion.div>

              {/* Bottom half — lower part of product + tagline, slides down */}
              <motion.div
                className="relative flex-1 overflow-hidden will-change-transform"
                initial={{ y: 0 }}
                animate={{ y: reduce ? 0 : ["0%", "0%", "100%"] }}
                transition={{
                  duration: SWEEP,
                  times: SWEEP_TIMES,
                  ease: [0.76, 0, 0.24, 1],
                }}
                style={{ backgroundColor: BEIGE }}
              >
                {/* Lower half of the product — integrated into the bottom composition */}
                <div
                  className="absolute left-1/2 top-0 -translate-x-1/2 overflow-hidden"
                  style={{
                    width: "min(72vw, 420px)",
                    height: "min(36vh, 260px)",
                  }}
                >
                  <img
                    src={productHero}
                    alt=""
                    aria-hidden
                    draggable={false}
                    className="absolute left-0 bottom-0 h-[200%] w-full object-contain object-bottom select-none"
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: -14 }}
                  animate={{ opacity: [0, 0, 1, 1, 0], y: [-14, -14, 0, 0, 6] }}
                  transition={{
                    duration: SWEEP,
                    times: TEXT_TIMES,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute bottom-0 left-0 right-0 px-6 pb-16 text-center sm:pb-20"
                >
                  <div
                    className="mx-auto mb-3 h-px"
                    style={{
                      width: "60px",
                      background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
                    }}
                  />
                  <p
                    className="text-[11px] font-light tracking-wide sm:text-sm"
                    style={{ color: COPY }}
                  >
                    Eine neue Schweizer Marke entsteht.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!show && isDev && (
        <button
          onClick={playIntro}
          aria-label="Intro erneut abspielen"
          className="fixed bottom-5 right-5 z-50 group flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: "rgba(240, 237, 230, 0.85)",
            border: `1px solid ${GOLD}`,
            color: INK,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9" />
            <polyline points="3 4 3 10 9 10" />
          </svg>
          <span className="text-xs font-medium tracking-wide">Intro</span>
        </button>
      )}
    </>
  );
};

export default IntroReveal;
