import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import premiumShot from "@/assets/raj-nexus-premium-shot.jpeg";

const SESSION_KEY = "raj_intro_seen";
const GOLD = "#9b6b3f";
const BEIGE = "#f0ede6";
const INK = "#2b2725";

/**
 * Premium "Curtain Reveal" intro shown once per session.
 * - Fullscreen product shot (split horizontally)
 * - Top half lifts up · bottom half drops down
 * - Center reveals "Herzlich Willkommen" gold script
 * - Total runtime ~3.2s, then unmounts and reveals the page
 */
const IntroReveal = () => {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsMobile(window.matchMedia("(max-width: 640px)").matches);
  }, []);

  // Mobile: snappier feel — shorter hold + faster sweep but same choreography
  const TOTAL = reduce ? 800 : isMobile ? 2400 : 3200;
  const SWEEP = reduce ? 0.6 : isMobile ? 2.2 : 3.0;
  // text in/out timing (fractions of SWEEP)
  const TEXT_TIMES = isMobile ? [0, 0.28, 0.5, 0.82, 1] : [0, 0.35, 0.55, 0.85, 1];
  const SWEEP_TIMES = isMobile ? [0, 0.5, 1] : [0, 0.55, 1];

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    setShow(true);
    sessionStorage.setItem(SESSION_KEY, "1");
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
  }, [TOTAL]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* TOP HALF — lifts up */}
          <motion.div
            className="absolute top-0 left-0 right-0 overflow-hidden"
            style={{ height: "50vh", backgroundColor: BEIGE }}
            initial={{ y: 0 }}
            animate={{ y: reduce ? 0 : ["0%", "0%", "-100%"] }}
            transition={{
              duration: 3.0,
              times: [0, 0.55, 1],
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            <div className="relative w-full h-full">
              <img
                src={premiumShot}
                alt=""
                className="absolute left-1/2 -translate-x-1/2 top-0 max-w-none"
                style={{
                  height: "100vh",
                  width: "auto",
                  objectFit: "contain",
                }}
                draggable={false}
              />
              {/* hairline edge */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
              />
            </div>
          </motion.div>

          {/* BOTTOM HALF — drops down */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 overflow-hidden"
            style={{ height: "50vh", backgroundColor: BEIGE }}
            initial={{ y: 0 }}
            animate={{ y: reduce ? 0 : ["0%", "0%", "100%"] }}
            transition={{
              duration: 3.0,
              times: [0, 0.55, 1],
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            <div className="relative w-full h-full">
              <img
                src={premiumShot}
                alt=""
                className="absolute left-1/2 -translate-x-1/2 bottom-0 max-w-none"
                style={{
                  height: "100vh",
                  width: "auto",
                  objectFit: "contain",
                }}
                draggable={false}
              />
            </div>
          </motion.div>

          {/* CENTER — welcome text revealed when curtains part */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: [0, 0, 1, 1, 0], y: [12, 12, 0, 0, -8] }}
              transition={{
                duration: 3.0,
                times: [0, 0.35, 0.55, 0.85, 1],
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center px-6"
            >
              <p
                className="text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-4"
                style={{ color: GOLD }}
              >
                EST. 2026 · Switzerland
              </p>
              <h2
                className="font-light tracking-tight"
                style={{
                  color: INK,
                  fontFamily: "'Cormorant Garamond', 'Didot', 'Times New Roman', serif",
                  fontSize: "clamp(2.25rem, 7vw, 4.5rem)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.05,
                }}
              >
                Herzlich
                <br />
                <span style={{ color: GOLD, fontStyle: "italic" }}>Willkommen</span>
              </h2>
              <div
                className="mx-auto mt-5 h-px"
                style={{
                  width: "80px",
                  background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
                }}
              />
              <p
                className="mt-4 text-xs sm:text-sm font-light tracking-wide"
                style={{ color: "#5a5550" }}
              >
                Eine neue Schweizer Marke entsteht.
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroReveal;
