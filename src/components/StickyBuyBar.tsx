import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StickyBuyBarProps {
  /** When the user scrolls past this element (in px from top), the bar appears. Default 600 */
  showAfterScroll?: number;
  price?: string;
  originalPrice?: string;
  label?: string;
}

/**
 * Mobile-only sticky bottom buy bar. Appears after scrolling past the hero.
 * Mirrors the Apple / Tesla pattern for fastest mobile conversion.
 */
export const StickyBuyBar = ({
  showAfterScroll = 600,
  price = "CHF 99.–",
  originalPrice = "CHF 129.–",
  label = "Jetzt kaufen",
}: StickyBuyBarProps) => {
  const [visible, setVisible] = useState(false);

  const openCheckout = () => {
    window.open("https://checkout.raj.ch", "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > showAfterScroll);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showAfterScroll]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-xl border-t border-border shadow-elegant-lg"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex flex-col leading-tight">
              <span className="text-xs text-muted-foreground line-through">{originalPrice}</span>
              <span className="text-lg font-bold text-primary">{price}</span>
            </div>
            <Button
              variant="hero"
              size="lg"
              className="flex-1 shadow-elegant"
              onClick={scrollToSignup}
            >
              <Zap className="w-4 h-4 mr-2" />
              {label}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyBuyBar;
