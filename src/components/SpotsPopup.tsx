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
          <p className="text-sm text-[#2c2c2c] pr-4">
            Noch <span className="font-bold text-[#9b6b3f]">{spotsLeft}</span> Plätze verfügbar.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpotsPopup;
