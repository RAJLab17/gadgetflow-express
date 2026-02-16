import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Zap, Cable, Monitor, Car, Sparkles } from "lucide-react";
import PreorderBanner from "@/components/PreorderBanner";
import PreorderForm from "@/components/PreorderForm";

import img1 from "@/assets/products/car-charger-1.png";
import img2 from "@/assets/products/car-charger-2.png";
import img3 from "@/assets/products/car-charger-3.png";
import img4 from "@/assets/products/car-charger-4.png";

const images = [img3, img1, img2, img4]; // img3 (Automatic Retraction) als Hauptbild

const CarChargerProduct = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPreorderForm, setShowPreorderForm] = useState(false);

  const features = [
    {
      icon: <Cable className="w-5 h-5" />,
      title: "Schluss mit Kabelsalat",
      description: "Einziehbare Kabel verschwinden automatisch nach Gebrauch",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "100W Schnellladung",
      description: "Maximale Power für alle deine Geräte gleichzeitig",
    },
    {
      icon: <Monitor className="w-5 h-5" />,
      title: "Digital Display",
      description: "Echtzeit-Anzeige von Spannung und Ladestatus",
    },
    {
      icon: <Car className="w-5 h-5" />,
      title: "4-in-1 Lösung",
      description: "USB-C, Lightning, Micro-USB & USB-A Port",
    },
  ];

  const specs = [
    "100W Gesamtleistung",
    "Einziehbare Ladekabel",
    "2x USB-C + 1x Lightning + 1x Micro-USB",
    "Zusätzlicher USB-A Port",
    "LED Digital Display",
    "Automatische Kabelrückführung",
    "Kompatibel mit 12V/24V Fahrzeugen",
    "Überhitzungsschutz & Kurzschlussschutz",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
                <img
                  src={images[selectedImage]}
                  alt="RAJTech Car Charger 4-in-1"
                  className="w-full h-full object-contain p-8"
                />
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  NEU
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Car Charger Ansicht ${index + 1}`}
                      className="w-full h-full object-contain bg-muted p-2"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-primary font-medium mb-2">RAJTech Auto</p>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Car Charger 4-in-1 Pro
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  <strong>Nie wieder Kabelsalat im Auto!</strong> Der RAJTech Car Charger 4-in-1 Pro 
                  ist die ultimative Ladelösung für dein Fahrzeug. Mit einziehbaren Kabeln, die sich 
                  automatisch zurückziehen, gehört das nervige Kabelgewirr endlich der Vergangenheit an. 
                  Alles ist immer schön ordentlich, griffbereit und sofort einsatzbereit – eine 
                  intelligente 4-in-1 Lösung für die ganze Familie.
                </p>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">CHF 42.45</span>
                <span className="text-lg text-muted-foreground line-through">
                  CHF 49.95
                </span>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                  -15%
                </span>
              </div>

              <PreorderBanner remainingSpots={85} />

              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                size="xl"
                variant="glow"
                className="w-full"
                onClick={() => setShowPreorderForm(true)}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Jetzt sichern
              </Button>

              {showPreorderForm && (
                <PreorderForm
                  productName="RAJTech Car Charger 4-in-1 Pro"
                  originalPrice={49.95}
                  discountPercent={15}
                  onSuccess={() => setShowPreorderForm(false)}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Die clevere Alternative zum <span className="text-primary">Kabelchaos</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Kennst du das? Du steigst ins Auto und findest ein Wirrwarr aus Kabeln in der 
              Mittelkonsole. Mit dem RAJTech Car Charger 4-in-1 Pro ist das Geschichte. Die 
              einziehbaren Kabel verschwinden nach dem Laden automatisch im Gerät – sauber, 
              ordentlich und immer einsatzbereit. Eine Lösung für iPhone, Android, Tablets 
              und mehr.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-background border border-border">
                <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✗</span>
                </div>
                <h3 className="font-semibold mb-2">Vorher</h3>
                <p className="text-sm text-muted-foreground">
                  Kabelsalat, verlorene Kabel, ständiges Suchen
                </p>
              </div>
              <div className="p-6 rounded-xl bg-background border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">RAJTech Lösung</h3>
                <p className="text-sm text-muted-foreground">
                  4-in-1 mit automatischer Kabelrückführung
                </p>
              </div>
              <div className="p-6 rounded-xl bg-background border border-border">
                <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Nachher</h3>
                <p className="text-sm text-muted-foreground">
                  Aufgeräumt, griffbereit, immer geladen
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Technische <span className="text-primary">Details</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {specs.map((spec, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-lg bg-muted/50"
                >
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarChargerProduct;
