import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import premiumShot from "@/assets/raj-nexus-premium-shot.jpeg";

const SESSION_KEY = "raj_intro_seen";
const GOLD = "#9b6b3f";
const BEIGE = "#f0ede6";
const INK = "#2b2725";

/**
 * Premium "Curtain Reveal" intro shown once per session.
 */
const IntroReveal = () => {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsMobile(window.matchMedia("(max-width: 640px)").matches);
    const host = window.location.hostname;
    setIsPreview(
      host.endsWith("lovable.app") ||
        host.endsWith("lovableproject.com") ||
        host === "localhost" ||
        host === "127.0.0.1"
    );
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
    if (typeof window === "undefined") return;
    if (!show) {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      setShow(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }
  }, [show]);

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
            className="fixed inset-0 z-[100] pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* TOP HALF */}
            <motion.div
              className="absolute top-0 left-0 right-0 overflow-hidden"
              style={{ height: "50vh", backgroundColor: BEIGE }}
              initial={{ y: 0 }}
              animate={{ y: reduce ? 0 : ["0%", "0%", "-100%"] }}
              transition={{
                duration: SWEEP,
                times: SWEEP_TIMES,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              <div className="relative w-full h-full">
                <img
                  src={premiumShot}
                  alt=""
                  className="absolute left-1/2 -translate-x-1/2 top-0"
                  style={
                    isMobile
                      ? {
                          width: "100vw",
                          height: "auto",
                          maxHeight: "100vh",
                          objectFit: "contain",
                        }
                      : {
                          height: "100vh",
                          width: "auto",
                          maxWidth: "100vw",
                          objectFit: "contain",
                        }
                  }
                  draggable={false}
                />
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: [0, 0, 1, 1, 0], y: [14, 14, 0, 0, -6] }}
                  transition={{
                    duration: SWEEP,
                    times: TEXT_TIMES,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute top-0 left-0 right-0 pt-10 sm:pt-20 text-center px-6"
                >
                  <p
                    className="text-[9px] sm:text-xs tracking-[0.35em] uppercase mb-3"
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
                <div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
                />
              </div>
            </motion.div>

            {/* BOTTOM HALF */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 overflow-hidden"
              style={{ height: "50vh", backgroundColor: BEIGE }}
              initial={{ y: 0 }}
              animate={{ y: reduce ? 0 : ["0%", "0%", "100%"] }}
              transition={{
                duration: SWEEP,
                times: SWEEP_TIMES,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              <div className="relative w-full h-full">
                <img
                  src={premiumShot}
                  alt=""
                  className="absolute left-1/2 -translate-x-1/2 bottom-0"
                  style={
                    isMobile
                      ? {
                          width: "100vw",
                          height: "auto",
                          maxHeight: "100vh",
                          objectFit: "contain",
                        }
                      : {
                          height: "100vh",
                          width: "auto",
                          maxWidth: "100vw",
                          objectFit: "contain",
                        }
                  }
                  draggable={false}
                />
                <motion.div
                  initial={{ opacity: 0, y: -14 }}
                  animate={{ opacity: [0, 0, 1, 1, 0], y: [-14, -14, 0, 0, 6] }}
                  transition={{
                    duration: SWEEP,
                    times: TEXT_TIMES,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute bottom-0 left-0 right-0 pb-10 sm:pb-20 text-center px-6"
                >
                  <div
                    className="mx-auto mb-3 h-px"
                    style={{
                      width: "60px",
                      background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
                    }}
                  />
                  <p
                    className="text-[11px] sm:text-sm font-light tracking-wide"
                    style={{ color: "#5a5550" }}
                  >
                    Eine neue Schweizer Marke entsteht.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!show && isPreview && (
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
