import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Zap, Smartphone, Watch, Headphones, Plane, Shield, Package } from "lucide-react";
import PreorderBanner from "@/components/PreorderBanner";
import PreorderForm from "@/components/PreorderForm";

// Product images - matching FeaturedProducts gallery
import charger3in1ColorsNew from "@/assets/products/charger-3in1-colors-new.png";
import charger3in1Action1 from "@/assets/products/charger-3in1-action1.png";
import charger3in1Action2 from "@/assets/products/charger-3in1-action2.png";
import charger3in1Angles from "@/assets/products/charger-3in1-angles.png";
import charger3in1Specs from "@/assets/products/charger-3in1-specs.png";

const productImages = [
  charger3in1ColorsNew, 
  charger3in1Action1, 
  charger3in1Action2, 
  charger3in1Angles, 
  charger3in1Specs
];

type ColorVariant = {
  id: string;
  name: string;
  color: string;
};

const colorVariants: ColorVariant[] = [
  {
    id: "black",
    name: "Space Black",
    color: "bg-gray-900 border border-gray-600",
  },
];

const features = [
  { icon: Zap, title: "25W Schnellladen", description: "Qi2.2 zertifiziert" },
  { icon: Smartphone, title: "iPhone Laden", description: "MagSafe kompatibel" },
  { icon: Watch, title: "Apple Watch", description: "Integrierter Lader" },
  { icon: Headphones, title: "AirPods", description: "Wireless Charging Pad" },
  { icon: Plane, title: "Reisefreundlich", description: "Faltbares Design" },
  { icon: Shield, title: "2 Jahre Garantie", description: "Premium Qualität" },
];

const WirelessCharger3in1Product = () => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [autoPlayKey, setAutoPlayKey] = useState(0);

  const selectedColor = colorVariants[selectedColorIndex];

  // Auto-rotate images every 4 seconds (same as FeaturedProducts)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSelectedImageIndex((prev) => (prev + 1) % productImages.length);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [selectedImageIndex, autoPlayKey]);

  // Manual selection - reset timer
  const handleImageSelect = useCallback((index: number) => {
    setSelectedImageIndex(index);
    setAutoPlayKey((prev) => prev + 1);
  }, []);

  // Swipe handlers for mobile
  const handleDragEnd = useCallback((event: any, info: { offset: { x: number } }) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      const nextIndex = (selectedImageIndex + 1) % productImages.length;
      handleImageSelect(nextIndex);
    } else if (info.offset.x > threshold) {
      const prevIndex = (selectedImageIndex - 1 + productImages.length) % productImages.length;
      handleImageSelect(prevIndex);
    }
  }, [selectedImageIndex, handleImageSelect]);

  const handleColorChange = (index: number) => {
    setSelectedColorIndex(index);
    setSelectedImageIndex(0);
    setAutoPlayKey((prev) => prev + 1);
  };

  const originalPrice = 123.75;

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Preorder Banner */}
        <PreorderBanner remainingSpots={97} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery - Same style as FeaturedProducts */}
          <div className="space-y-6">
            {/* Main Image with swipe support */}
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
                  key={selectedImageIndex}
                  src={productImages[selectedImageIndex]}
                  alt={`RAJ NEXUS 3-in-1 Wireless Charger - ${selectedColor.name}`}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-contain p-6"
                />
              </AnimatePresence>
            </motion.div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 justify-center flex-wrap">
              {productImages.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleImageSelect(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden transition-all duration-300 ${
                    selectedImageIndex === index 
                      ? "ring-2 ring-primary shadow-elegant" 
                      : "ring-1 ring-border hover:ring-primary/50"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Ansicht ${index + 1}`}
                    className="w-full h-full object-contain p-2"
                  />
                  {selectedImageIndex === index && (
                    <motion.div
                      layoutId="activeThumbProduct"
                      className="absolute inset-0 bg-primary/10"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Color: Space Black */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Farbe:</span>
              <span className="text-sm font-medium">Space Black</span>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                VORBESTELLUNG
              </span>
              <span className="px-3 py-1 bg-accent/20 text-accent-foreground text-xs font-semibold rounded-full">
                Qi2.2 Zertifiziert
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-primary">RAJ NEXUS</span>
            </h1>
            <p className="text-xl font-semibold text-foreground mb-1">
              3-in-1 Wireless Charger
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              Qi2.2 • 25W
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-primary text-primary"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(89 Bewertungen)</span>
            </div>

            {/* Price - Prominent */}
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-5xl font-bold text-primary">CHF {(originalPrice * 0.8).toFixed(2)}</span>
              <div className="flex flex-col">
                <span className="text-lg text-muted-foreground line-through">CHF {originalPrice.toFixed(2)}</span>
                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                  SPARE 20%
                </span>
              </div>
            </div>
            
            {/* Free Cable Bonus - Compact */}
            <div className="flex items-center gap-2 mb-4 text-green-500">
              <span className="text-lg">🎁</span>
              <span className="text-sm font-semibold">
                + Gratis Kabel (Wert CHF 26.99)
              </span>
            </div>

            {/* Description - Compact */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Die 3-in-1 Ladestation für iPhone, Apple Watch und AirPods mit Qi2.2 und 25W Fast Charge.
              Faltbar, kompakt und perfekt für unterwegs.
            </p>

            {/* Features Grid - Compact */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30"
                >
                  <feature.icon className="w-4 h-4 text-primary flex-shrink-0" />
                  <p className="text-xs font-medium">{feature.title}</p>
                </div>
              ))}
            </div>

            {/* Preorder Form */}
            <PreorderForm
              productName="RAJ NEXUS 3-in-1 Wireless Charger"
              productVariant={selectedColor.name}
              originalPrice={originalPrice}
              discountPercent={20}
            />

            {/* Trust Badges */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>2J Garantie</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="w-4 h-4 text-primary" />
                <span>Gratis Versand</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-primary" />
                <span>2-4 Wochen</span>
              </div>
            </div>

            {/* Certification Badges */}
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="px-2.5 py-1 bg-secondary text-xs font-semibold rounded-full border border-border">
                Qi2.2
              </span>
              <span className="px-2.5 py-1 bg-secondary text-xs font-semibold rounded-full border border-border">
                CE
              </span>
              <span className="px-2.5 py-1 bg-secondary text-xs font-semibold rounded-full border border-border">
                RoHS
              </span>
              <span className="px-2.5 py-1 bg-secondary text-xs font-semibold rounded-full border border-border">
                FCC
              </span>
            </div>

          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-secondary/30 rounded-2xl p-6 border border-border/50">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Technische Spezifikationen
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Qi2.2 Zertifizierung</span>
                <span className="font-medium">Ja</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Max. Ladeleistung</span>
                <span className="font-medium">25W</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Apple Watch Laden</span>
                <span className="font-medium">5W</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">AirPods Laden</span>
                <span className="font-medium">5W</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Abmessungen (gefaltet)</span>
                <span className="font-medium">8.3 × 8.3 × 3.2 cm</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Eingang</span>
                <span className="font-medium">USB-C PD</span>
              </li>
            </ul>
          </div>

          <div className="bg-secondary/30 rounded-2xl p-6 border border-border/50">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Lieferumfang
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>1× RAJ NEXUS 3-in-1 Wireless Charger</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>1× USB-C Ladekabel (1.5m)</span>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong className="text-primary">Tipp:</strong> Für optimale Ladeleistung empfehlen wir 
                ein 30W+ USB-C Netzteil (nicht im Lieferumfang).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WirelessCharger3in1Product;
