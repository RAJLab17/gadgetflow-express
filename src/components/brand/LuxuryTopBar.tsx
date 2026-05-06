import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage, type Language } from "@/contexts/LanguageContext";

const GOLD = "#9b6b3f";
const GOLD_SOFT = "#c8946b";

const LANGS: { code: Language; label: string }[] = [
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
  { code: "it", label: "IT" },
  { code: "en", label: "EN" },
];

const ROTATE_KEYS = ["topbar.shipping", "topbar.madeIn"] as const;

const LuxuryTopBar = () => {
  const { lang, setLang, t } = useLanguage();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % ROTATE_KEYS.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] w-full"
      style={{
        background: "linear-gradient(90deg, #050403 0%, #0d0a07 50%, #050403 100%)",
        borderBottom: `1px solid ${GOLD}25`,
        backdropFilter: "blur(8px)",
      }}
    >
      {/* gold hairline shimmer */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${GOLD_SOFT}, transparent)`,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 h-9">
          {/* left: swiss flag dot */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: GOLD, boxShadow: `0 0 8px ${GOLD}` }}
            />
            <span
              className="text-[9px] font-light uppercase text-white/55"
              style={{ letterSpacing: "0.4em" }}
            >
              Swiss · Est. 2025
            </span>
          </div>

          {/* center: rotating luxury message */}
          <div className="flex-1 flex justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={ROTATE_KEYS[idx]}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-[10px] sm:text-[11px] font-light uppercase text-white/75 text-center truncate max-w-[80vw]"
                style={{ letterSpacing: "0.28em" }}
              >
                {t(ROTATE_KEYS[idx])}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* right: language pill */}
          <div
            className="relative flex items-center gap-px shrink-0 rounded-full p-0.5"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${GOLD}33`,
            }}
          >
            {LANGS.map((l) => {
              const active = lang === l.code;
              return (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className="relative px-2 sm:px-2.5 py-1 text-[10px] font-medium transition-colors"
                  style={{
                    color: active ? "#0a0908" : "rgba(255,255,255,0.55)",
                    letterSpacing: "0.2em",
                  }}
                  aria-pressed={active}
                >
                  {active && (
                    <motion.span
                      layoutId="lang-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: GOLD_SOFT }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuxuryTopBar;
