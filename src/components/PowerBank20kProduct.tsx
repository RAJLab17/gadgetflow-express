import { useState } from "react";
import { Zap, Battery, Shield, Cable, Star, Check, Truck, RotateCcw, Smartphone, Timer } from "lucide-react";
import PreorderBanner from "@/components/PreorderBanner";
import ShopifyBuyButton from "@/components/ShopifyBuyButton";

// Import images
import blackImg from "@/assets/products/powerbank-20k-black.webp";
import whiteImg from "@/assets/products/powerbank-20k-white.webp";
import sandImg from "@/assets/products/powerbank-20k-sand.webp";
import greenImg from "@/assets/products/powerbank-20k-green.webp";
import blueImg from "@/assets/products/powerbank-20k-blue.webp";

interface ColorVariant {
  id: string;
  name: string;
  color: string;
  image: string;
}

const colorVariants: ColorVariant[] = [
  {
    id: "black",
    name: "Midnight Black",
    color: "bg-gray-900 border border-gray-600",
    image: blackImg,
  },
  {
    id: "sand",
    name: "Desert Sand",
    color: "bg-amber-200",
    image: sandImg,
  },
  {
    id: "green",
    name: "Forest Green",
    color: "bg-green-800",
    image: greenImg,
  },
  {
    id: "blue",
    name: "Ocean Blue",
    color: "bg-blue-900",
    image: blueImg,
  },
  {
    id: "white",
    name: "Arctic White",
    color: "bg-white border border-gray-300",
    image: whiteImg,
  },
];

const features = [
  { icon: Battery, text: "20.000mAh Kapazität" },
  { icon: Zap, text: "PD3.0 22.5W Fast-Charging" },
  { icon: Cable, text: "4 integrierte Kabel" },
  { icon: Smartphone, text: "Alle Geräte kompatibel" },
];

const PowerBank20kProduct = () => {
  const [selectedColor, setSelectedColor] = useState(colorVariants[0]);

  const originalPrice = 59;

  const handleColorChange = (variant: ColorVariant) => {
    setSelectedColor(variant);
  };

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Preorder Banner */}
        <PreorderBanner remainingSpots={78} />

        {/* NEU Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full border border-primary/30">
            <Zap className="w-4 h-4 fill-primary" />
            <span className="text-sm font-semibold">NEU – Jetzt sichern</span>
            <Zap className="w-4 h-4 fill-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images & Color Selection */}
          <div className="relative">
            {/* Main Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/50 border border-border mb-4">
              <img
                src={selectedColor.image}
                alt={`RAJTech PowerBank Ultra 20K - ${selectedColor.name}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Color Selection - Under Images */}
            <div className="p-4 bg-card rounded-xl border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3 text-center">
                Farbe: <span className="text-primary">{selectedColor.name}</span>
              </h3>
              <div className="flex justify-center gap-3">
                {colorVariants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => handleColorChange(variant)}
                    className={`relative w-14 h-14 rounded-xl ${variant.color} transition-all duration-300 hover:scale-110 ${
                      selectedColor.id === variant.id
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                        : ""
                    }`}
                    title={variant.name}
                  >
                    {selectedColor.id === variant.id && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className={`h-5 w-5 drop-shadow-lg ${variant.id === 'white' || variant.id === 'sand' ? 'text-gray-800' : 'text-white'}`} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <div className="mb-4">
              <span className="text-primary text-sm font-medium tracking-wider uppercase">
                RAJTech Premium
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              PowerBank Ultra 20K
            </h1>

            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Die ultimative Power für deinen Alltag: <strong className="text-foreground">20.000mAh</strong> in einem schlanken Design 
              mit <strong className="text-primary">Fast-Charging PD3.0 bis 22.5W</strong> – damit du nie wieder auf Strom warten musst. 
              Das Highlight: <strong className="text-foreground">4 integrierte Ladekabel</strong> (USB-C, Lightning, Micro-USB) sind 
              immer dabei. Kein Kabelsalat, kein Vergessen – einfach einstecken und los.
            </p>

            {/* USP Highlight */}
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Timer className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Blitzschnell geladen – für den Alltag gemacht</p>
                  <p className="text-sm text-muted-foreground">
                    PD3.0 mit bis zu 22.5W lädt dein iPhone in nur 30 Min. auf 50%
                  </p>
                </div>
              </div>
            </div>

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
              <span className="text-muted-foreground">(1.253 Bewertungen)</span>
            </div>

            {/* Price - Show preorder discount */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-4xl font-bold text-foreground">CHF {(originalPrice * 0.85).toFixed(2)}</span>
              <span className="text-xl text-muted-foreground line-through">CHF {originalPrice.toFixed(2)}</span>
              <span className="bg-primary/20 text-primary px-2 py-1 rounded-md text-sm font-semibold">
                -15% Vorbesteller
              </span>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Buy Button */}
            <ShopifyBuyButton
              price={`CHF ${(originalPrice * 0.85).toFixed(2)}`}
              originalPrice={`CHF ${originalPrice.toFixed(2)}`}
              discountLabel="-15% Vorbesteller"
            />

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 pt-6 mt-6 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="w-4 h-4 text-primary" />
                <span>Kostenloser Versand</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RotateCcw className="w-4 h-4 text-primary" />
                <span>30 Tage Rückgabe</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>2-4 Wochen Lieferzeit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Warum die PowerBank Ultra 20K dein neuer Begleiter wird
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Cable className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Alles dabei</h3>
              <p className="text-sm text-muted-foreground">
                4 integrierte Kabel für iPhone, Android, USB-C und mehr – du brauchst nie wieder ein separates Kabel.
              </p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Ultra-Schnell</h3>
              <p className="text-sm text-muted-foreground">
                Mit PD3.0 und 22.5W lädst du dein iPhone 15 in nur 30 Minuten auf 50% – egal wo du bist.
              </p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Battery className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Tagelange Power</h3>
              <p className="text-sm text-muted-foreground">
                20.000mAh für 4-5 komplette Ladevorgänge – genug Energie für ein ganzes Wochenende ohne Steckdose.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PowerBank20kProduct;
