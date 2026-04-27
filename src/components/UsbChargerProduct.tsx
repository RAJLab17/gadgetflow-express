import { useState } from "react";
import { Zap, Shield, Smartphone, Clock, ChevronRight, Check, Laptop } from "lucide-react";
import PreorderBanner from "./PreorderBanner";
import ShopifyBuyButton from "./ShopifyBuyButton";

import usbChargerDevices from "@/assets/products/usb-charger-devices.webp";
import usbChargerWhite1 from "@/assets/products/usb-charger-white-1.png";
import usbChargerWhite2 from "@/assets/products/usb-charger-white-2.png";
import usbChargerAction from "@/assets/products/usb-charger-action.webp";

const productImages = [
  { id: 1, src: usbChargerDevices, alt: "USB-C Schnellladegerät mit verschiedenen Smartphones" },
  { id: 2, src: usbChargerWhite1, alt: "USB-C Ladegerät Frontansicht" },
  { id: 3, src: usbChargerWhite2, alt: "USB-C Ladegerät Seitenansicht" },
  { id: 4, src: usbChargerAction, alt: "USB-C Ladegerät am Laptop" },
];

const UsbChargerProduct = () => {
  const [selectedImage, setSelectedImage] = useState(productImages[0]);

  return (
    <div className="min-h-screen bg-background">
      {/* Preorder Banner */}
      <PreorderBanner remainingSpots={42} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Main Product Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl overflow-hidden">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-full object-contain p-4"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square bg-muted/30 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage.id === image.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-contain p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
                NEU
              </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
                RAJTech USB-C Schnellladegerät 65W
              </h1>
              <p className="text-muted-foreground text-lg">
                Lädt dein Handy bis zu 3× schneller – damit du weniger Zeit mit Warten verbringst 
                und mehr Zeit für das hast, was wirklich zählt.
              </p>
            </div>

            {/* Key USPs */}
            <div className="space-y-3">
              {[
                { icon: Zap, text: "65W Schnellladung – 3× schneller als Standard-Ladegeräte" },
                { icon: Smartphone, text: "Dual-Port: USB-C + USB-A für 2 Geräte gleichzeitig" },
                { icon: Shield, text: "Intelligenter Überhitzungs- und Überladeschutz" },
                { icon: Laptop, text: "Kompatibel mit iPhone, Samsung, Xiaomi & mehr" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Buy Button */}
            <ShopifyBuyButton
              price="CHF 33.99"
              originalPrice="CHF 39.99"
              discountLabel="-15%"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 border-t border-border">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Warum das RAJTech <span className="text-primary">Schnellladegerät</span>?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Blitzschnelles Laden",
                description: "65W Power Delivery lädt dein iPhone oder Android-Gerät in kürzester Zeit auf – ideal für unterwegs.",
              },
              {
                icon: Smartphone,
                title: "2 Geräte gleichzeitig",
                description: "USB-C und USB-A Port ermöglichen das gleichzeitige Laden von Smartphone und Kopfhörern.",
              },
              {
                icon: Shield,
                title: "Maximale Sicherheit",
                description: "Mehrfacher Schutz vor Überladung, Überhitzung und Kurzschluss für deine Geräte.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-transparent border border-border/50 hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Specifications */}
        <div className="py-16 border-t border-border">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Technische <span className="text-primary">Daten</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { label: "Gesamtleistung", value: "65W" },
              { label: "USB-C Ausgang", value: "5V/3A, 9V/3A, 12V/3A, 20V/3.25A (max. 65W)" },
              { label: "USB-A Ausgang", value: "5V/2.4A, 9V/2A (max. 18W)" },
              { label: "Eingangsspannung", value: "100-240V AC, 50/60Hz" },
              { label: "Abmessungen", value: "45 × 45 × 28mm" },
              { label: "Gewicht", value: "62g" },
              { label: "Sicherheitszertifikate", value: "CE, FCC, RoHS" },
              { label: "Garantie", value: "24 Monate" },
            ].map((spec, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 rounded-xl bg-muted/30 border border-border/50"
              >
                <span className="text-muted-foreground">{spec.label}</span>
                <span className="font-medium">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compatibility Section */}
        <div className="py-16 border-t border-border">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Universal <span className="text-primary">Kompatibel</span>
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
            Funktioniert mit allen gängigen Smartphones, Tablets und Kopfhörern:
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "iPhone 15/14/13/12",
              "Samsung Galaxy S24/S23",
              "Xiaomi 14/13",
              "Google Pixel 8/7",
              "OnePlus 12/11",
              "iPad",
              "AirPods",
              "Galaxy Buds",
            ].map((device, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-muted/50 rounded-full text-sm border border-border/50"
              >
                {device}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsbChargerProduct;
