import { useState } from "react";
import { Check, Zap, Laptop, Smartphone, Shield, Cpu, Timer, Plug } from "lucide-react";
import PreorderBanner from "./PreorderBanner";
import PreorderForm from "./PreorderForm";

// Import product images
import ganChargerAction from "@/assets/products/gan-charger-1.png";
import ganChargerWhite from "@/assets/products/gan-charger-white.png";
import ganChargerBlack from "@/assets/products/gan-charger-black.png";

const colorVariants = [
  {
    name: "Midnight Black",
    color: "#1a1a1a",
    image: ganChargerBlack,
  },
  {
    name: "Pure White",
    color: "#ffffff",
    image: ganChargerWhite,
  },
];

const productImages = [ganChargerAction, ganChargerBlack, ganChargerWhite];

const GanChargerProduct = () => {
  const [selectedColor, setSelectedColor] = useState(colorVariants[0]);
  const [selectedImage, setSelectedImage] = useState(ganChargerAction);

  return (
    <div className="min-h-screen bg-background">
      <PreorderBanner remainingSpots={38} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-muted/30 to-muted rounded-3xl overflow-hidden flex items-center justify-center p-8">
              <img
                src={selectedImage}
                alt="RAJTech GaN SuperCharger 100W"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
            
            {/* Thumbnail gallery */}
            <div className="flex gap-3">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Product view ${index + 1}`}
                    className="w-full h-full object-contain bg-muted/30 p-1"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  NEU
                </span>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-sm font-medium rounded-full">
                  Laptop-Power
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                RAJTech GaN SuperCharger 100W
              </h1>
              
              <p className="text-muted-foreground text-lg leading-relaxed">
                <strong>Das ultimative Ladegerät für Power-User.</strong> Mit modernster GaN III-Technologie 
                und 100W Gesamtleistung laden Sie Laptop, Smartphone, Tablet und Zubehör gleichzeitig – 
                schneller und effizienter als je zuvor. <strong>4 Ports, 1 Lösung, 0 Kompromisse.</strong>
              </p>
            </div>

            {/* USP Highlights */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-4 border border-primary/20">
                <Cpu className="w-6 h-6 text-primary mb-2" />
                <div className="font-semibold text-sm">GaN III Technologie</div>
                <div className="text-xs text-muted-foreground">40% kleiner, 50% effizienter</div>
              </div>
              <div className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 rounded-2xl p-4 border border-amber-500/20">
                <Zap className="w-6 h-6 text-amber-500 mb-2" />
                <div className="font-semibold text-sm">100W Gesamtleistung</div>
                <div className="text-xs text-muted-foreground">Laptop + Phone gleichzeitig</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 rounded-2xl p-4 border border-emerald-500/20">
                <Timer className="w-6 h-6 text-emerald-500 mb-2" />
                <div className="font-semibold text-sm">PD 3.0 Fast-Charging</div>
                <div className="text-xs text-muted-foreground">iPhone in 30 Min. auf 50%</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 rounded-2xl p-4 border border-blue-500/20">
                <Plug className="w-6 h-6 text-blue-500 mb-2" />
                <div className="font-semibold text-sm">4 Ports (3×USB-C + 1×USB-A)</div>
                <div className="text-xs text-muted-foreground">Alle Geräte auf einmal</div>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Farbe wählen</span>
                <span className="text-sm text-muted-foreground">{selectedColor.name}</span>
              </div>
              <div className="flex gap-3">
                {colorVariants.map((variant) => (
                  <button
                    key={variant.name}
                    onClick={() => {
                      setSelectedColor(variant);
                      setSelectedImage(variant.image);
                    }}
                    className={`w-12 h-12 rounded-full border-2 transition-all relative ${
                      selectedColor.name === variant.name
                        ? "border-primary ring-4 ring-primary/20 scale-110"
                        : "border-border hover:border-primary/50"
                    }`}
                    style={{ backgroundColor: variant.color }}
                    title={variant.name}
                  >
                    {selectedColor.name === variant.name && (
                      <Check className={`w-5 h-5 absolute inset-0 m-auto ${variant.name === "Pure White" ? "text-foreground" : "text-white"}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Laptop className="w-5 h-5 text-primary" />
                Perfekt für Gaming-Laptops & mehr
              </h3>
              <ul className="space-y-2">
                {[
                  "Kompatibel mit MacBook Pro, HP Omen, ASUS TUF, Dell G-Series",
                  "USB-C1: Max. 100W für Laptops",
                  "USB-C2/C3: Bis zu 30W für Smartphones & Tablets",
                  "USB-A: 22.5W für ältere Geräte & Zubehör",
                  "PD 3.0, QC 4.0+, PPS für maximale Kompatibilität",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety & Certifications */}
            <div className="bg-muted/30 rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-emerald-500" />
                <span className="font-semibold">Sicherheit & Zertifizierungen</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  CE, FCC, RoHS zertifiziert
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Überhitzungsschutz
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Kurzschlussschutz
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Überladungsschutz
                </div>
              </div>
            </div>

            {/* Technical Specs */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Technische Daten</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-muted/20 rounded-lg p-3">
                  <div className="text-muted-foreground">Eingang</div>
                  <div className="font-medium">AC 100-240V, 50/60Hz</div>
                </div>
                <div className="bg-muted/20 rounded-lg p-3">
                  <div className="text-muted-foreground">Gesamtleistung</div>
                  <div className="font-medium">100W (max.)</div>
                </div>
                <div className="bg-muted/20 rounded-lg p-3">
                  <div className="text-muted-foreground">USB-C1 Output</div>
                  <div className="font-medium">5-20V / 5A (100W max)</div>
                </div>
                <div className="bg-muted/20 rounded-lg p-3">
                  <div className="text-muted-foreground">USB-C2/C3 Output</div>
                  <div className="font-medium">5-20V / 1.5A (30W max)</div>
                </div>
                <div className="bg-muted/20 rounded-lg p-3">
                  <div className="text-muted-foreground">USB-A Output</div>
                  <div className="font-medium">5-12V / 22.5W (QC3.0)</div>
                </div>
                <div className="bg-muted/20 rounded-lg p-3">
                  <div className="text-muted-foreground">Masse</div>
                  <div className="font-medium">73 × 73 × 30 mm</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preorder Form Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Jetzt <span className="text-primary">vorbestellen</span> und sparen
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sichere dir den GaN SuperCharger 100W zum exklusiven Einführungspreis. 
              Lade Laptop, Smartphone und mehr mit einem einzigen Gerät – zukunftssicher und ultra-kompakt.
            </p>
          </div>
          
          <PreorderForm
            productName="RAJTech GaN SuperCharger 100W"
            productVariant={selectedColor.name}
            originalPrice={79}
            discountPercent={15}
          />
        </div>
      </div>
    </div>
  );
};

export default GanChargerProduct;
