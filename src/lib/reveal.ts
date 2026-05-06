import { useEffect, useRef } from "react";

/**
 * Lightweight CSS-driven scroll reveal.
 * Replaces framer-motion `whileInView` patterns at a fraction of the cost.
 * Adds the `reveal-in` class once the element enters the viewport.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(opts?: {
  rootMargin?: string;
  once?: boolean;
}) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("reveal-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("reveal-in");
            if (opts?.once !== false) io.unobserve(el);
          } else if (opts?.once === false) {
            el.classList.remove("reveal-in");
          }
        }
      },
      { rootMargin: opts?.rootMargin ?? "-60px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [opts?.rootMargin, opts?.once]);
  return ref;
}
