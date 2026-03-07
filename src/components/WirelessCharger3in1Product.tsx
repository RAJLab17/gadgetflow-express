import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Shield, Package, Layers, CheckCircle } from "lucide-react";
import ShopifyBuyButton from "@/components/ShopifyBuyButton";
import WaitlistForm from "@/components/WaitlistForm";
import { fetchProductVariantInfo } from "@/lib/shopify";

// Product images
import charger3in1ColorsNew from "@/assets/products/charger-3in1-colors-new.png";
import charger3in1Action1 from "@/assets/products/charger-3in1-action1.png";
import charger3in1Action2 from "@/assets/products/charger-3in1-action2.png";
import charger3in1Angles from "@/assets/products/charger-3in1-angles.png";
import charger3in1Specs from "@/assets/products/charger-3in1-specs.png";
import charger3in1LifestyleHome from "@/assets/products/charger-3in1-lifestyle-home.png";
import charger3in1LifestyleOffice from "@/assets/products/charger-3in1-lifestyle-office.png";

const productImages = [
  charger3in1ColorsNew,
  charger3in1Action1,
  charger3in1Action2,
  charger3in1Angles,
  charger3in1Specs,
  charger3in1LifestyleHome,
  charger3in1LifestyleOffice,
];

const NEXUS_HANDLE = "raj-3-in-1-wireless-charger";

const WirelessCharger3in1Product = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [autoPlayKey, setAutoPlayKey] = useState(0);
  const [inventory, setInventory] = useState<number>(100);
  const [availableForSale, setAvailableForSale] = useState<boolean>(true);
  const [variantId, setVariantId] = useState<string>("gid://shopify/ProductVariant/57169031823685");

  // Fetch variant ID + inventory dynamically from Shopify
  useEffect(() => {
    fetchProductVariantInfo(NEXUS_HANDLE).then(info => {
      if (info) {
        setVariantId(info.variantId);
        setInventory(info.quantityAvailable);
        setAvailableForSale(info.availableForSale);
      }
    });
  }, []);

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSelectedImageIndex((prev) => (prev + 1) % productImages.length);
    }, 4000);
    return () => clearTimeout(timeout);
  }, [selectedImageIndex, autoPlayKey]);

  const handleImageSelect = useCallback((index: number) => {
    setSelectedImageIndex(index);
    setAutoPlayKey((prev) => prev + 1);
  }, []);

  const handleDragEnd = useCallback(
    (_event: any, info: { offset: { x: number } }) => {
      const threshold = 50;
      if (info.offset.x < -threshold) {
        handleImageSelect((selectedImageIndex + 1) % productImages.length);
      } else if (info.offset.x > threshold) {
        handleImageSelect(
          (selectedImageIndex - 1 + productImages.length) % productImages.length
        );
      }
    },
    [selectedImageIndex, handleImageSelect]
  );

  const originalPrice = 129;

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* ===== HERO SECTION ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Product Info */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <h1 className="text-5xl md:text-6xl font-bold mb-2 text-foreground">
              RAJ <span className="text-primary">NEXUS</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              3-in-1 Wireless Charger
            </p>
            <p className="text-base text-muted-foreground mb-6 italic">
              Qi neu definiert.
            </p>

            <div className="border-t border-border pt-4 mb-6">
              <p className="text-base text-muted-foreground">
                Erste Serie · Die ersten {inventory} Exemplare
              </p>
              {inventory > 0 && inventory <= 10 && (
                <p className="text-sm font-semibold text-destructive mt-2 animate-pulse">
                  ⚠️ Nur noch {inventory} Stück verfügbar!
                </p>
              )}
            </div>

            <p className="text-4xl md:text-5xl font-bold text-primary mb-6">
              CHF 99.–
            </p>

            {availableForSale && inventory > 0 ? (
              <a
                href="https://kcvjif-10.myshopify.com/products/raj-3-in-1-wireless-charger"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors duration-300 w-fit"
              >
                <Zap className="w-5 h-5" />
                Jetzt kaufen
              </a>
            ) : (
              <WaitlistForm />
            )}

          </div>

          {/* Right: Image Gallery */}
          <div className="space-y-4 order-1 lg:order-2">
            <motion.div
              className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted shadow-elegant-lg cursor-grab active:cursor-grabbing"
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
                  alt="RAJ NEXUS 3-in-1 Wireless Charger"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-contain p-6"
                />
              </AnimatePresence>
            </motion.div>

            {/* Thumbnails */}
            <div className="flex gap-3 justify-center flex-wrap">
              {productImages.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleImageSelect(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden transition-all duration-300 ${
                    selectedImageIndex === index
                      ? "ring-2 ring-primary shadow-elegant"
                      : "ring-1 ring-border hover:ring-primary/50"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Ansicht ${index + 1}`}
                    className="w-full h-full object-contain p-1.5"
                  />
                </motion.button>
              ))}
            </div>

            {/* Feature highlights */}
            <div className="flex items-center justify-center gap-6 pt-2 text-sm text-muted-foreground">
              <span className="font-medium">25W Schnellladen</span>
              <span className="text-border">|</span>
              <span className="font-semibold text-primary">Qi2</span>
              <span className="text-border">|</span>
              <span className="font-medium">3-in-1</span>
              <span className="text-border">|</span>
              <span className="font-medium">2 Jahre Garantie</span>
            </div>
          </div>
        </div>


        {/* ===== DETAILS + ORDER SECTION ===== */}
        <div id="order" className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 scroll-mt-[40vh]">
          {/* Left Column: Availability + Specs */}
          <div className="space-y-6">
            {/* Availability */}
            <div className="p-6 bg-card rounded-2xl border border-border">
              <h3 className="text-lg font-bold text-foreground mb-3">
                Erste Serie · Limitierte Verfügbarkeit
              </h3>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg border border-border">
                <span className="text-4xl font-bold text-primary">{inventory}</span>
                <span className="text-sm text-muted-foreground">
                  Exemplaren verfügbar
                </span>
              </div>
            </div>

            {/* Technical Specs */}
            <div className="p-6 bg-card rounded-2xl border border-border">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
                <Zap className="w-5 h-5 text-primary" />
                Technische Spezifikationen
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  ["Qi2 Zertifizierung", "✓"],
                  ["Max. Ladeleistung", "25W"],
                  ["Max. Ladeleistung (Smart Watch)", "3 Watt"],
                  ["Artikel-Material", "Aluminium"],
                  ["Abmessungen", "83 x 83 x 32 mm"],
                  ["Lieferumfang", "USB-C PD"],
                ].map(([label, value], i) => (
                  <li
                    key={i}
                    className="flex justify-between border-b border-border/50 pb-2 last:border-0"
                  >
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Buy Button + Lieferumfang */}
          <div className="space-y-6">
            <ShopifyBuyButton
              variantId={variantId}
              price="CHF 99.–"
              originalPrice="CHF 129.–"
              discountLabel="-23% Einführungspreis"
              soldOut={!availableForSale || inventory <= 0}
            />

            {/* Lieferumfang */}
            <div className="p-6 bg-card rounded-2xl border border-border">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
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
                  <span>1× USB-C auf USB-C Kabel (1.3m)</span>
                </li>
              </ul>

              <div className="mt-4 p-4 bg-secondary/50 rounded-lg border border-border/50">
                <p className="text-sm text-muted-foreground">
                  <CheckCircle className="inline w-4 h-4 text-primary mr-1" />
                  Nahtlose magnetische Ladeoberfläche mit dem neuen Qi2. MFW1. Standard für
                  präzises kabelloses Laden.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WirelessCharger3in1Product;
