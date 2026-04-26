import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

interface AnimatedPriceProps {
  from: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * Counts from `from` → `to` when scrolled into view.
 * Used for the hero price reveal (CHF 129 → CHF 99).
 */
export const AnimatedPrice = ({
  from,
  to,
  duration = 1.4,
  prefix = "CHF ",
  suffix = ".–",
  className,
}: AnimatedPriceProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(from, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, from, to, duration]);

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${to}${suffix}`}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
};

export default AnimatedPrice;
