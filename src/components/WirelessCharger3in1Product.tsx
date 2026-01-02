import { useState } from "react";
import { Star, Zap, Smartphone, Watch, Headphones, Plane, Shield, Package } from "lucide-react";
import PreorderBanner from "@/components/PreorderBanner";
import PreorderForm from "@/components/PreorderForm";

// Black images
import blackImg1 from "@/assets/products/charger-3in1-black-1.png";
import blackImg2 from "@/assets/products/charger-3in1-black-2.png";
import blackImg3 from "@/assets/products/charger-3in1-black-3.png";
import blackImg4 from "@/assets/products/charger-3in1-black-4.png";

type ColorVariant = {
  id: string;
  name: string;
  color: string;
  images: string[];
};

const colorVariants: ColorVariant[] = [
  {
    id: "black",
    name: "Space Black",
    color: "bg-gray-900 border border-gray-600",
    images: [blackImg1, blackImg2, blackImg3, blackImg4],
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

  const selectedColor = colorVariants[selectedColorIndex];

  const handleColorChange = (index: number) => {
    setSelectedColorIndex(index);
    setSelectedImageIndex(0);
  };

  const originalPrice = 69;

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
                src={selectedColor.images[selectedImageIndex]}
                alt={`RAJTech 3-in-1 Wireless Charger - ${selectedColor.name}`}
                className="w-full h-full object-contain p-4"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {selectedColor.images.map((img, index) => (
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

            {/* Color Selection - Under Images */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Farbe:</span>
              <div className="flex gap-2">
                {colorVariants.map((variant, index) => (
                  <button
                    key={variant.id}
                    onClick={() => handleColorChange(index)}
                    className={`w-8 h-8 rounded-full ${variant.color} transition-all duration-300 ${
                      selectedColorIndex === index
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                        : "hover:scale-105"
                    }`}
                    title={variant.name}
                  />
                ))}
              </div>
              <span className="text-sm font-medium ml-2">{selectedColor.name}</span>
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              RAJTech 3-in-1 <span className="text-primary">Wireless Charger</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Faltbare MagSafe Ladestation mit 25W Schnellladen
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

            {/* Price - Show original and savings */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-primary">CHF {(originalPrice * 0.9).toFixed(2)}</span>
              <span className="text-xl text-muted-foreground line-through">CHF {originalPrice.toFixed(2)}</span>
              <span className="px-2 py-1 bg-primary/20 text-primary text-sm font-semibold rounded">
                -10% Vorbesteller
              </span>
            </div>

            {/* Description */}
            <div className="prose prose-invert mb-8">
              <p className="text-muted-foreground leading-relaxed">
                Die ultimative All-in-One Ladelösung für Apple-Nutzer. Lade dein iPhone, Apple Watch 
                und AirPods gleichzeitig mit bis zu 25W Schnellladen. Das innovative faltbare Design 
                macht diese Ladestation zum perfekten Reisebegleiter – kompakt zusammengeklappt 
                passt sie in jede Tasche.
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
              productName="RAJTech 3-in-1 Wireless Charger"
              productVariant={selectedColor.name}
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
                <span className="font-medium">5W Wireless</span>
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
                <span>1× RAJTech 3-in-1 Wireless Charger</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>1× USB-C Ladekabel (1.5m)</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>1× Benutzerhandbuch (DE/EN)</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>1× Premium Reiseetui</span>
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
