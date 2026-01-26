import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Sparkles, Zap, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import charger3in1Hero from "@/assets/products/charger-3in1-hero.png";
import charger3in1Black1 from "@/assets/products/charger-3in1-black-1.png";
import charger3in1Black2 from "@/assets/products/charger-3in1-black-2.png";
import charger3in1ColorsMain from "@/assets/products/charger-3in1-colors-main.png";

const product = {
  id: 7,
  name: "3-in-1 Wireless Charger",
  price: 62.10,
  originalPrice: 69,
  images: [charger3in1ColorsMain, charger3in1Hero, charger3in1Black1, charger3in1Black2],
  rating: 5,
  reviews: 89,
  category: "Premium Collection",
  link: "/product/wireless-charger-3in1",
  description: "Lade iPhone, Apple Watch und AirPods gleichzeitig mit bis zu 25W – elegant und kompakt.",
  colors: [
    { name: "Schwarz", value: "#1a1a1a" },
    { name: "Rosé Gold", value: "#b76e5c" },
    { name: "Silber", value: "#a8a8a8" },
    { name: "Blau", value: "#6b8cae" },
    { name: "Anthrazit", value: "#2d2d2d" },
  ],
  features: [
    { icon: Zap, label: "25W Schnellladen" },
    { icon: Shield, label: "2 Jahre Garantie" },
    { icon: Sparkles, label: "Qi2.2 Zertifiziert" },
  ],
};

const FeaturedProducts = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);

  return (
    <section id="products" className="py-24 md:py-32 relative overflow-hidden">
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
            Perfekte <span className="text-primary">Eleganz</span>
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
            <div className="space-y-6">
              {/* Main Image */}
              <motion.div 
                className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted shadow-elegant-lg group"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.4 }}
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
                  -10% Vorbesteller
                </motion.div>

              </motion.div>
              {/* Thumbnail Gallery */}
              <div className="flex gap-3 justify-center">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden transition-all duration-300 ${
                      selectedImage === index 
                        ? "ring-2 ring-primary shadow-elegant" 
                        : "ring-1 ring-border hover:ring-primary/50"
                    }`}
                  >
                    <div className="w-full h-full bg-card">
                      <img
                        src={image}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    {selectedImage === index && (
                      <motion.div
                        layoutId="activeThumb"
                        className="absolute inset-0 bg-primary/10"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8 lg:sticky lg:top-32">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-primary text-sm font-semibold uppercase tracking-[0.15em]">
                  {product.category}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-primary fill-primary"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews})</span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Color Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Farbe wählen</span>
                  <span className="text-sm text-muted-foreground">{product.colors[selectedColor].name}</span>
                </div>
                <div className="flex gap-3">
                  {product.colors.map((color, index) => (
                    <motion.button
                      key={color.name}
                      onClick={() => setSelectedColor(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative w-12 h-12 rounded-full transition-all duration-300 ${
                        selectedColor === index 
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background" 
                          : "ring-1 ring-border hover:ring-primary/50"
                      }`}
                      style={{ backgroundColor: color.value }}
                    >
                      {selectedColor === index && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Check className="w-5 h-5 text-white drop-shadow-md" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
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
              <div className="space-y-6 pt-6 border-t border-border">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl md:text-5xl font-bold text-primary">
                    CHF {product.price.toFixed(2)}
                  </span>
                  <span className="text-xl text-muted-foreground line-through">
                    CHF {product.originalPrice.toFixed(2)}
                  </span>
                  <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-semibold">
                    Spare CHF {(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </div>

                {/* Quick Buy Buttons */}
                <div className="flex flex-col gap-3">
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
                        Jetzt vorbestellen
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
                  <p className="text-center text-sm text-muted-foreground">
                    ✓ Kostenloser Versand · ✓ 30 Tage Rückgabe · ✓ Sichere Zahlung
                  </p>
                </div>
              </div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-6 pt-6"
              >
                {["Apple", "MagSafe", "Qi2"].map((brand, index) => (
                  <div key={brand} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{brand} kompatibel</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
