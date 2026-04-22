import { motion, AnimatePresence } from "framer-motion";
import type { Slide } from "./HeroCarousel";

const BEIGE = "#f0ede6";

interface Props {
  slide: Slide;
  index: number;
}

// Lazy-loaded so framer-motion stays out of the LCP critical path.
const HeroCarouselRotator = ({ slide, index }: Props) => (
  <AnimatePresence mode="sync">
    <motion.img
      key={`img-${index}`}
      src={slide.image}
      srcSet={`${slide.imageSm} 480w, ${slide.image} 800w`}
      sizes="(max-width: 640px) 480px, 800px"
      alt={slide.alt}
      width={800}
      height={800}
      loading="lazy"
      decoding="async"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="absolute inset-0 w-full h-full"
      style={{ objectFit: "contain", backgroundColor: BEIGE }}
    />
  </AnimatePresence>
);

export default HeroCarouselRotator;
