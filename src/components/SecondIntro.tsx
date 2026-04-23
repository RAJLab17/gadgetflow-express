import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import beforeAfter from "@/assets/intro-before-after.png";

const GOLD = "#9b6b3f";
const BEIGE = "#f0ede6";
const INK = "#2b2725";

/**
 * Second intro shown right after the curtain reveal.
 * Displays the Before/After image with a strong overline headline.
 */
const SECOND_INTRO_DELAY = 0; // Show immediately
const SECOND_INTRO_DURATION_DESKTOP = 7000;
const SECOND_INTRO_DURATION_MOBILE = 6000;

const SecondIntro = () => {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsMobile(window.matchMedia("(max-width: 640px)").matches);

    const startDelay = reduce ? 800 : SECOND_INTRO_DELAY;
    const duration = reduce
      ? 1200
      : window.matchMedia("(max-width: 640px)").matches
        ? SECOND_INTRO_DURATION_MOBILE
        : SECOND_INTRO_DURATION_DESKTOP;

    const startTimer = window.setTimeout(() => {
      setShow(true);
      document.body.style.overflow = "hidden";

      const endTimer = window.setTimeout(() => {
        setShow(false);
        document.body.style.overflow = "";
      }, duration);

      (window as Window & { __rajSecondIntroEnd?: number }).__rajSecondIntroEnd = endTimer;
    }, startDelay);

    return () => {
      window.clearTimeout(startTimer);
      const endTimer = (window as Window & { __rajSecondIntroEnd?: number }).__rajSecondIntroEnd;
      if (endTimer) window.clearTimeout(endTimer);
      document.body.style.overflow = "";
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[99] flex flex-col items-center justify-center px-5 py-8"
          style={{ backgroundColor: BEIGE }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Overline */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-[9px] sm:text-xs tracking-[0.35em] uppercase mb-4 text-center"
            style={{ color: GOLD }}
          >
            RAJ NEXUS
          </motion.p>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-light tracking-tight text-center mb-6 sm:mb-10 max-w-2xl"
            style={{
              color: INK,
              fontFamily: "'Cormorant Garamond', 'Didot', 'Times New Roman', serif",
              fontSize: "clamp(1.5rem, 6.5vw, 3.25rem)",
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
            }}
          >
            Dein Setup wird endlich{" "}
            <span style={{ color: GOLD, fontStyle: "italic" }}>clean.</span>
            <br />
            <span className="text-[0.7em]" style={{ color: "#5a5550" }}>
              Kein Suchen. Kein Einstecken.
            </span>
          </motion.h2>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[420px] sm:max-w-[480px]"
          >
            <img
              src={beforeAfter}
              alt="RAJ NEXUS – Vorher / Nachher Vergleich"
              className="w-full h-auto rounded-lg shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]"
              draggable={false}
            />
          </motion.div>

          {/* Bottom hairline */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 h-px"
            style={{
              width: "80px",
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
              transformOrigin: "center",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SecondIntro;
