import { useState } from "react";
import { Star, Zap, Smartphone, Watch, Headphones, Plane, Shield, Package, Battery, Layers } from "lucide-react";
import PreorderBanner from "@/components/PreorderBanner";
import PreorderForm from "@/components/PreorderForm";

// Foldable charger images
import techImg from "@/assets/products/charger-foldable-tech.webp";
import phoneImg from "@/assets/products/charger-foldable-phone.webp";
import airpodsImg from "@/assets/products/charger-foldable-airpods.webp";
import materialImg from "@/assets/products/charger-foldable-material.webp";
import standImg from "@/assets/products/charger-foldable-stand.webp";

const productImages = [standImg, phoneImg, airpodsImg, techImg, materialImg];

const features = [
  { icon: Zap, title: "15W Schnellladen", description: "MagSafe kompatibel" },
  { icon: Smartphone, title: "iPhone Laden", description: "Starke Magnetkraft" },
  { icon: Watch, title: "Apple Watch", description: "Integrierter Lader" },
  { icon: Headphones, title: "AirPods", description: "Wireless Charging" },
  { icon: Plane, title: "Ultra Portabel", description: "Faltbares Design" },
  { icon: Shield, title: "2 Jahre Garantie", description: "Premium Qualität" },
];

const FoldableWirelessChargerProduct = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const originalPrice = 49;

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Preorder Banner */}
        <PreorderBanner remainingSpots={97} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="relative">
            {/* Main Image */}
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary/50 border border-border mb-4">
              <img
                src={productImages[selectedImageIndex]}
                alt="RAJTech Foldable 3-in-1 Wireless Charger"
                className="w-full h-full object-contain p-4"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImageIndex === index
                      ? "border-primary shadow-[0_0_15px_hsl(var(--primary)/0.4)]"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Ansicht ${index + 1}`}
                    className="w-full h-full object-contain p-1 bg-secondary/50"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                VORBESTELLUNG
              </span>
              <span className="px-3 py-1 bg-accent/20 text-accent-foreground text-xs font-semibold rounded-full">
                MagSafe Kompatibel
              </span>
              <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full">
                Ultra Portabel
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              RAJTech Foldable <span className="text-primary">3-in-1 Charger</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Ultra-kompakte MagSafe Ladestation für unterwegs
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
              <span className="text-sm text-muted-foreground">(127 Bewertungen)</span>
            </div>

            {/* Price - Show original and savings */}
            <div className="flex items-baseline gap-3 mb-6 flex-wrap">
              <span className="text-4xl font-bold text-primary">CHF {(originalPrice * 0.9).toFixed(2)}</span>
              <span className="text-xl text-muted-foreground line-through">CHF {originalPrice.toFixed(2)}</span>
              <span className="px-2 py-1 bg-primary/20 text-primary text-sm font-semibold rounded">
                -10% Vorbesteller
              </span>
            </div>

            {/* Description */}
            <div className="prose prose-invert mb-8">
              <p className="text-muted-foreground leading-relaxed">
                Die perfekte Reise-Ladestation für alle Apple-Geräte. Mit 15W MagSafe Schnellladen, 
                starker magnetischer Positionierung und einem innovativen faltbaren Design. 
                Gefertigt aus hochwertigem eloxiertem Aluminium für maximale Langlebigkeit – 
                korrosionsbeständig und rostfrei für jahrelangen Einsatz wie am ersten Tag.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50"
                >
                  <feature.icon className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Preorder Form */}
            <PreorderForm
              productName="RAJTech Foldable 3-in-1 Charger"
              productVariant="Space Black"
              originalPrice={originalPrice}
              discountPercent={10}
            />

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>2 Jahre Garantie</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="w-4 h-4 text-primary" />
                <span>Kostenloser Versand</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-primary" />
                <span>2-4 Wochen Lieferzeit</span>
              </div>
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
                <span className="text-muted-foreground">Material</span>
                <span className="font-medium">Aluminium + Gehärtetes Glas</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Schutzfunktionen</span>
                <span className="font-medium text-right">Kurzschluss, Überspannung, Überladung</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Ladeleistung</span>
                <span className="font-medium">5W / 7.5W / 10W / 15W</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Eingang</span>
                <span className="font-medium">USB-C (5V/2A, 9V/2A)</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Effizienz</span>
                <span className="font-medium">≥85%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Gewicht</span>
                <span className="font-medium">197g</span>
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
                <span>1× RAJTech Foldable 3-in-1 Charger</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>1× USB-C Ladekabel (1.2m)</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>1× Benutzerhandbuch (DE/EN)</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>1× Reisebeutel</span>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong className="text-primary">Premium Material:</strong> Eloxiertes Aluminium – 
                korrosionsbeständig und langlebig wie am ersten Tag.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Highlights with Images */}
        <div className="mt-16 space-y-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Warum der <span className="text-primary">RAJTech Foldable Charger</span>?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-secondary/30 rounded-2xl overflow-hidden border border-border/50 group hover:border-primary/50 transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={phoneImg} 
                  alt="15W Schnellladen" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Battery className="w-5 h-5 text-primary" />
                  <h3 className="font-bold">15W Wireless Fast Charging</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Starke magnetische Positionierung für perfekte Ausrichtung und maximale Ladeeffizienz.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-secondary/30 rounded-2xl overflow-hidden border border-border/50 group hover:border-primary/50 transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={materialImg} 
                  alt="Premium Material" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-5 h-5 text-primary" />
                  <h3 className="font-bold">Eloxiertes Aluminium</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Korrosionsbeständig, rostfrei und langlebig – jahrelanger Einsatz wie am ersten Tag.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-secondary/30 rounded-2xl overflow-hidden border border-border/50 group hover:border-primary/50 transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={standImg} 
                  alt="Portables Design" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Plane className="w-5 h-5 text-primary" />
                  <h3 className="font-bold">Faltbar & Portabel</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Kompaktes faltbares Design – passt in jede Tasche für maximale Mobilität.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* YouTube Video Section */}
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Erlebe den <span className="text-primary">RAJTech Charger</span> in Aktion
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video rounded-2xl overflow-hidden border border-border/50 bg-secondary/30">
              <iframe
                src="https://www.youtube.com/embed/NFGfypDRymY?start=0&end=15&autoplay=0&controls=1&rel=0&modestbranding=1"
                title="RAJTech Foldable 3-in-1 Charger Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Schau dir an, wie einfach das Laden deiner Apple-Geräte sein kann.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoldableWirelessChargerProduct;
