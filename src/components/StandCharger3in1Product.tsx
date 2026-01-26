import { useState } from "react";
import { Star, Zap, Shield, Battery, Watch, Headphones, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import PreorderBanner from "@/components/PreorderBanner";
import PreorderForm from "@/components/PreorderForm";

// Import product images
import heroImg from "@/assets/products/charger-stand-hero.png";
import whiteImg from "@/assets/products/charger-stand-white.png";
import blueImg from "@/assets/products/charger-stand-blue.png";
import pinkImg from "@/assets/products/charger-stand-pink.png";
import mintImg from "@/assets/products/charger-stand-mint.png";
import blackImg from "@/assets/products/charger-stand-black.png";
import techImg from "@/assets/products/charger-stand-tech.png";

type ColorVariant = {
  id: string;
  name: string;
  color: string;
  images: string[];
};

const colorVariants: ColorVariant[] = [
  {
    id: "black",
    name: "Schwarz",
    color: "#1A1A1A",
    images: [blackImg, heroImg, techImg],
  },
  {
    id: "white",
    name: "Pearl White",
    color: "#F5F5F5",
    images: [whiteImg, heroImg, techImg],
  },
  {
    id: "blue",
    name: "Ocean Blue",
    color: "#4FC3F7",
    images: [blueImg, heroImg, techImg],
  },
  {
    id: "pink",
    name: "Rose Pink",
    color: "#F8BBD9",
    images: [pinkImg, heroImg, techImg],
  },
  {
    id: "mint",
    name: "Mint Green",
    color: "#80CBC4",
    images: [mintImg, heroImg, techImg],
  },
];

const features = [
  {
    icon: Zap,
    title: "15W Schnellladen",
    description: "Maximale Ladegeschwindigkeit für alle kompatiblen Geräte",
  },
  {
    icon: Shield,
    title: "Sicherheitsschutz",
    description: "Überstrom-, Überspannungs- und Temperaturschutz",
  },
  {
    icon: Smartphone,
    title: "iPhone Kompatibel",
    description: "Optimiert für iPhone 15/14/13/12 Serie",
  },
  {
    icon: Watch,
    title: "Apple Watch Ready",
    description: "Alle Apple Watch Modelle werden unterstützt",
  },
  {
    icon: Headphones,
    title: "AirPods Laden",
    description: "Kompatibel mit AirPods Pro und AirPods 3",
  },
  {
    icon: Battery,
    title: "Qi-Zertifiziert",
    description: "Universelle Wireless Charging Kompatibilität",
  },
];

const StandCharger3in1Product = () => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const selectedVariant = colorVariants[selectedColorIndex];
  const currentImages = selectedVariant.images;

  const handleColorChange = (index: number) => {
    setSelectedColorIndex(index);
    setSelectedImageIndex(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Preorder Banner */}
      <PreorderBanner remainingSpots={75} />

      {/* Product Section */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-secondary/50 to-secondary overflow-hidden border border-border">
                <img
                  src={currentImages[selectedImageIndex]}
                  alt={`RAJTech Stand 3-in-1 Charger - ${selectedVariant.name}`}
                  className="w-full h-full object-contain p-4"
                />
              </div>

              {/* Color Selector - Under main image */}
              <div className="flex items-center gap-3 justify-center py-2">
                <span className="text-sm text-muted-foreground mr-2">Farbe:</span>
                {colorVariants.map((variant, index) => (
                  <button
                    key={variant.id}
                    onClick={() => handleColorChange(index)}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 transition-all duration-300 hover:scale-110",
                      selectedColorIndex === index
                        ? "border-primary ring-2 ring-primary/30 scale-110"
                        : "border-border hover:border-primary/50"
                    )}
                    style={{ backgroundColor: variant.color }}
                    title={variant.name}
                  />
                ))}
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-3 justify-center">
                {currentImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                      selectedImageIndex === index
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <img
                      src={image}
                      alt={`Ansicht ${index + 1}`}
                      className="w-full h-full object-contain bg-secondary/50 p-1"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full mb-3">
                  Premium Kollektion
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  RAJTech Stand 3-in-1 Wireless Charger
                </h1>
                <p className="text-muted-foreground">
                  Ausgewählte Farbe:{" "}
                  <span className="text-foreground font-medium">
                    {selectedVariant.name}
                  </span>
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">(127 Bewertungen)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-foreground">
                  €53,99
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  €59,99
                </span>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded">
                  -10%
                </span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                Der RAJTech Stand 3-in-1 Wireless Charger ist die perfekte Lösung für 
                alle Apple-Nutzer. Laden Sie Ihr iPhone, Ihre Apple Watch und Ihre 
                AirPods gleichzeitig mit nur einem Gerät. Das elegante Steh-Design 
                spart Platz auf Ihrem Schreibtisch und bietet optimalen Blickwinkel 
                für Ihr iPhone während des Ladens.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Preorder Form */}
              <PreorderForm
                productName="RAJTech Stand 3-in-1 Wireless Charger"
                productVariant={selectedVariant.name}
                originalPrice={59.99}
                discountPercent={10}
              />
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">
                Technische Daten
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Ausgangsleistung Smartphone", value: "15W / 10W / 7.5W / 5W" },
                  { label: "Ausgangsleistung Apple Watch", value: "3W" },
                  { label: "Ausgangsleistung AirPods", value: "5W" },
                  { label: "Eingang", value: "USB-C, 9V/3A oder 12V/2A" },
                  { label: "Kabellänge", value: "1.2m USB-C" },
                  { label: "Kompatibilität", value: "iPhone 15/14/13/12, Apple Watch, AirPods" },
                  { label: "Zertifizierung", value: "Qi-zertifiziert, CE, FCC, RoHS" },
                  { label: "Material", value: "ABS + PC, rutschfeste Silikon-Pads" },
                ].map((spec) => (
                  <div
                    key={spec.label}
                    className="flex justify-between py-3 border-b border-border"
                  >
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="text-foreground font-medium">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">
                Im Lieferumfang
              </h3>
              <ul className="space-y-3">
                {[
                  "1x RAJTech Stand 3-in-1 Wireless Charger",
                  "1x USB-C Ladekabel (1.2m)",
                  "1x Premium Verpackung",
                  "GRATIS: 1x Magnetisches Ladekabel (bei Vorbestellung)",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span
                      className={cn(
                        "text-foreground",
                        index === 4 && "text-primary font-semibold"
                      )}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Safety Features */}
              <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <h4 className="text-lg font-bold text-foreground mb-4">
                  Sicherheitsfeatures
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Überstromschutz",
                    "Temperaturschutz",
                    "Überspannungsschutz",
                    "Strahlungsabschirmung",
                  ].map((safety) => (
                    <div key={safety} className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{safety}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StandCharger3in1Product;
