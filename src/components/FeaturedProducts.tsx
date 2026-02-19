import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Zap, Shield, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import charger3in1ColorsNew from "@/assets/products/charger-3in1-colors-new.png";
import charger3in1Action1 from "@/assets/products/charger-3in1-action1.png";
import charger3in1Action2 from "@/assets/products/charger-3in1-action2.png";
import charger3in1Angles from "@/assets/products/charger-3in1-angles.png";
import charger3in1Specs from "@/assets/products/charger-3in1-specs.png";
import charger3in1LifestyleHome from "@/assets/products/charger-3in1-lifestyle-home.png";
import charger3in1LifestyleOffice from "@/assets/products/charger-3in1-lifestyle-office.png";

const product = {
  id: 7,
  name: "3-in-1 Wireless Charger",
  price: 99.00,
  originalPrice: 129,
  images: [charger3in1ColorsNew, charger3in1Action1, charger3in1Action2, charger3in1Angles, charger3in1Specs, charger3in1LifestyleHome, charger3in1LifestyleOffice],
  rating: 5,
  reviews: 89,
  category: "Premium Collection",
  link: "/product/wireless-charger-3in1",
  description: "Lade iPhone, Apple Watch und AirPods gleichzeitig mit bis zu 25W – elegant und kompakt.",
  features: [
    { icon: Zap, label: "25W Schnellladen" },
    { icon: Sparkles, label: "Qi2.2 Zertifiziert" },
    { icon: Shield, label: "2 Jahre Garantie" },
  ],
};

const FeaturedProducts = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  
  const [autoPlayKey, setAutoPlayKey] = useState(0);

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [selectedImage, autoPlayKey]);

  // Manual selection - reset timer
  const handleImageSelect = useCallback((index: number) => {
    setSelectedImage(index);
    setAutoPlayKey((prev) => prev + 1);
  }, []);

  // Swipe handlers
  const handleDragEnd = useCallback((event: any, info: { offset: { x: number } }) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      // Swiped left - next image
      const nextIndex = (selectedImage + 1) % product.images.length;
      handleImageSelect(nextIndex);
    } else if (info.offset.x > threshold) {
      // Swiped right - previous image
      const prevIndex = (selectedImage - 1 + product.images.length) % product.images.length;
      handleImageSelect(prevIndex);
    }
  }, [selectedImage, handleImageSelect]);
  return (
    <section id="products" className="pt-8 md:pt-12 pb-12 md:pb-16 relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[200px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/4" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold uppercase tracking-[0.15em] mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Unser Flaggschiff
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Perfekte <span className="text-primary">Eleganz.</span> <span className="text-primary">Qi2</span> neu definiert.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Entworfen für höchste Ansprüche. Qualität, die man sieht und fühlt.
          </p>
        </motion.div>

        {/* Premium Product Display */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Product Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <motion.div 
                className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted shadow-elegant-lg group cursor-grab active:cursor-grabbing"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.4 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={product.images[selectedImage]}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-contain p-6"
                  />
                </AnimatePresence>
                
                {/* Premium Badge */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="absolute top-6 right-6 px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-elegant font-semibold text-sm flex items-center gap-2"
                >
                  <span className="animate-pulse">🔥</span>
                  -23% Vorbesteller
                </motion.div>

              </motion.div>
              {/* Thumbnail Gallery */}
              <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleImageSelect(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl overflow-hidden transition-all duration-300 ${
                      selectedImage === index 
                        ? "ring-2 ring-primary shadow-elegant" 
                        : "ring-1 ring-border hover:ring-primary/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-contain p-1"
                    />
                    {selectedImage === index && (
                      <motion.div
                        layoutId="activeThumb"
                        className="absolute inset-0 bg-primary/10"
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Category */}
              <div>
                <span className="text-primary text-sm font-semibold uppercase tracking-[0.15em]">
                  {product.category}
                </span>
              </div>

              {/* Color: Space Black */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Farbe:</span>
                <span className="text-sm font-medium">Space Black</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-5 lg:sticky lg:top-32">

              {/* Title & Description */}
              <div>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 tracking-tight">
                  <span className="text-primary">RAJ NEXUS</span>
                </h3>
                <p className="text-xl md:text-2xl font-semibold text-foreground mb-1">
                  3-in-1 Wireless Charger
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                {product.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border"
                  >
                    <feature.icon className="w-6 h-6 text-primary" />
                    <span className="text-xs font-medium text-center text-muted-foreground">{feature.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Price & CTA */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl font-bold text-primary">
                    CHF {Number.isInteger(product.price) ? `${product.price}.–` : product.price.toFixed(2)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    CHF {Number.isInteger(product.originalPrice) ? `${product.originalPrice}.–` : product.originalPrice.toFixed(2)}
                  </span>
                  <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                    -23%
                  </span>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    variant="hero" 
                    size="xl" 
                    className="w-full text-lg shadow-elegant-lg group"
                    asChild
                  >
                    <Link to={product.link}>
                      Jetzt sichern
                      <motion.span
                        className="ml-2"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </Link>
                  </Button>
                </motion.div>

                <p className="text-center text-xs text-muted-foreground">
                  Swiss Brand · Gratis Versand · 30 Tage Rückgabe
                </p>

                {/* Compatibility Badges - Inline */}
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-primary" /> Apple
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-primary" /> MagSafe
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-primary" /> Qi2
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
