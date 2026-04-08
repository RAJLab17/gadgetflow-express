import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface SpotsPopupProps {
  spotsLeft: number;
}

const SpotsPopup = ({ spotsLeft }: SpotsPopupProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem("spots_popup_shown");
    if (shown) return;

    const showTimer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem("spots_popup_shown", "1");
    }, 6000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const hideTimer = setTimeout(() => setVisible(false), 8000);
    return () => clearTimeout(hideTimer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-5 left-5 z-50 px-5 py-4 rounded-xl shadow-lg max-w-[260px]"
          style={{
            background: "#f0ede6",
            border: "1px solid #9b6b3f",
          }}
        >
          <button
            onClick={() => setVisible(false)}
            className="absolute top-2 right-2 text-[#888888] hover:text-[#2c2c2c] transition-colors"
            aria-label="Schliessen"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2.5 pr-4">
            <span className="relative flex h-3 w-3 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <p className="text-base font-bold text-[#2c2c2c]">
              Noch <span className="text-lg font-extrabold text-[#9b6b3f]">{spotsLeft}</span> Plätze verfügbar.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpotsPopup;
