import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BearMascot = () => {
  const [visible, setVisible] = useState(false);
  const [showSecondBubble, setShowSecondBubble] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setShowSecondBubble(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (typeof window !== "undefined" && window.innerWidth >= 768) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.6 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-16 left-3 z-[60] md:hidden"
          onClick={() => setVisible(false)}
        >
          {/* Second speech bubble */}
          <AnimatePresence>
            {showSecondBubble && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative mb-1 ml-2"
              >
                <div className="bg-[#f5f0e8] rounded-xl px-3 py-1.5 shadow-md border border-[#c4a67a] max-w-[140px]">
                  <p className="text-xs font-bold text-[#2b2725] leading-tight">
                    Dein Platz wartet.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* First speech bubble */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative mb-1.5 ml-2"
          >
            <div className="bg-[#f5f0e8] rounded-xl px-3 py-1.5 shadow-md border border-[#c4a67a] max-w-[140px]">
              <p className="text-xs font-bold text-[#2b2725] leading-tight">
                Hey. Bleib kurz.
              </p>
              {/* Arrow pointing down-right toward sticky button */}
              <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-[#f5f0e8] border-b border-r border-[#c4a67a] rotate-45" />
            </div>
          </motion.div>

          {/* Bear */}
          <div className="cursor-pointer">
            <svg width="52" height="56" viewBox="0 0 52 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Ears */}
              <circle cx="12" cy="12" r="8" fill="#d4b896" stroke="#9b6b3f" strokeWidth="1.5" />
              <circle cx="40" cy="12" r="8" fill="#d4b896" stroke="#9b6b3f" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="4" fill="#c4a67a" />
              <circle cx="40" cy="12" r="4" fill="#c4a67a" />

              {/* Head */}
              <ellipse cx="26" cy="26" rx="18" ry="17" fill="#d4b896" stroke="#9b6b3f" strokeWidth="1.5" />

              {/* Snout */}
              <ellipse cx="26" cy="30" rx="8" ry="6" fill="#f0ede6" />

              {/* Eyes - looking at user */}
              <circle cx="19" cy="23" r="3" fill="#2b2725" />
              <circle cx="33" cy="23" r="3" fill="#2b2725" />
              <circle cx="20" cy="22" r="1" fill="white" />
              <circle cx="34" cy="22" r="1" fill="white" />

              {/* Nose */}
              <ellipse cx="26" cy="28" rx="2.5" ry="1.8" fill="#2b2725" />

              {/* Mouth */}
              <path d="M24 31 Q26 33 28 31" stroke="#2b2725" strokeWidth="1" strokeLinecap="round" fill="none" />

              {/* Body */}
              <ellipse cx="26" cy="48" rx="14" ry="8" fill="#d4b896" stroke="#9b6b3f" strokeWidth="1.5" />

              {/* Lightning bolt on chest */}
              <path d="M24 43 L27 43 L25.5 46 L28.5 46 L24 52 L25.5 48 L23 48 Z" fill="#9b6b3f" />
            </svg>
          </div>

          {/* Animated arrow pointing down, centered under bear */}
          <AnimatePresence>
            {showSecondBubble && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7, y: [0, 4, 0] }}
                transition={{ delay: 0.5, y: { repeat: Infinity, duration: 1.2, ease: "easeInOut" } }}
                className="absolute -bottom-5 left-5"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 12 L3 6 L5 6 L5 2 L9 2 L9 6 L11 6 Z" fill="#9b6b3f" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BearMascot;
