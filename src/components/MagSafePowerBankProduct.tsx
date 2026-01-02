import { useState } from "react";
import { ShoppingCart, Zap, Battery, Shield, Magnet, Star, Check, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Orange images
import orangeImg1 from "@/assets/products/powerbank-orange-1.png";
import orangeImg2 from "@/assets/products/powerbank-orange-2.png";
import orangeImg3 from "@/assets/products/powerbank-orange-3.png";

// Pink images
import pinkImg1 from "@/assets/products/powerbank-pink-1.png";
import pinkImg2 from "@/assets/products/powerbank-pink-2.png";
import pinkImg3 from "@/assets/products/powerbank-pink-3.png";

// Black images
import blackImg1 from "@/assets/products/powerbank-black-1.png";
import blackImg2 from "@/assets/products/powerbank-black-2.png";
import blackImg3 from "@/assets/products/powerbank-black-3.png";

// All colors image
import allColorsImg from "@/assets/products/powerbank-all-colors.png";

interface ColorVariant {
  id: string;
  name: string;
  color: string;
  images: string[];
}

const colorVariants: ColorVariant[] = [
  {
    id: "orange",
    name: "Sunset Orange",
    color: "bg-orange-500",
    images: [orangeImg1, orangeImg2, orangeImg3, allColorsImg],
  },
  {
    id: "pink",
    name: "Rose Pink",
    color: "bg-pink-400",
    images: [pinkImg1, pinkImg2, pinkImg3, allColorsImg],
  },
  {
    id: "black",
    name: "Midnight Black",
    color: "bg-gray-900",
    images: [blackImg1, blackImg2, blackImg3, allColorsImg],
  },
];

const features = [
  { icon: Magnet, text: "Starker MagSafe Halt" },
  { icon: Battery, text: "10.000mAh Kapazität" },
  { icon: Zap, text: "15W Schnellladung" },
  { icon: Shield, text: "Integrierter Ständer" },
];

const MagSafePowerBankProduct = () => {
  const [selectedColor, setSelectedColor] = useState(colorVariants[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { toast } = useToast();

  const handleColorChange = (variant: ColorVariant) => {
    setSelectedColor(variant);
    setSelectedImageIndex(0);
  };

  const handleAddToCart = () => {
    toast({
      title: "Zum Warenkorb hinzugefügt!",
      description: `MagSafe PowerBank Pro - ${selectedColor.name}`,
    });
  };

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Bestseller Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full border border-primary/30">
            <Star className="w-4 h-4 fill-primary" />
            <span className="text-sm font-semibold">Meistverkauftes Produkt 2025</span>
            <Star className="w-4 h-4 fill-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images & Color Selection */}
          <div className="relative">
            {/* Main Image */}
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-secondary/50 border border-border mb-4">
              <img
                src={selectedColor.images[selectedImageIndex]}
                alt={`RAJTech MagSafe PowerBank Pro - ${selectedColor.name}`}
                className="w-full h-full object-cover"
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
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
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
                        <Check className="h-5 w-5 text-white drop-shadow-lg" />
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
              MagSafe PowerBank Pro
            </h1>

            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Unsere meistverkaufte PowerBank verbindet modernste MagSafe-Technologie mit elegantem Design. 
              Der starke Magnet hält sicher an deinem iPhone, während du es kabellos mit bis zu 15W auflädst. 
              Der integrierte Ständer macht sie zum perfekten Begleiter für unterwegs – ob im Café, im Auto oder auf Reisen.
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
              <span className="text-muted-foreground">(2.847 Bewertungen)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-4xl font-bold text-foreground">CHF 49</span>
              <span className="text-xl text-muted-foreground line-through">CHF 79</span>
              <span className="bg-primary/20 text-primary px-2 py-1 rounded-md text-sm font-semibold">
                -38%
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

            {/* Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button variant="hero" size="xl" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                In den Warenkorb
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-border">
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
                <span>2 Jahre Garantie</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Warum unsere Kunden die PowerBank Pro lieben
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Magnet className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Perfekter Halt</h3>
              <p className="text-sm text-muted-foreground">
                Starke N52-Magnete für einen sicheren Halt – selbst beim Laufen oder Telefonieren.
              </p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Blitzschnell</h3>
              <p className="text-sm text-muted-foreground">
                Bis zu 15W kabelloses Laden – dein iPhone ist in kürzester Zeit wieder voll.
              </p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Battery className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Maximale Power</h3>
              <p className="text-sm text-muted-foreground">
                10.000mAh für 2-3 komplette Ladevorgänge – genug Energie für den ganzen Tag.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MagSafePowerBankProduct;
