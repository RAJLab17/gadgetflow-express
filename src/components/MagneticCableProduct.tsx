import { useState } from "react";
import { ShoppingCart, Star, Check, Zap, Shield, Cable } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import cableGalaxy from "@/assets/products/cable-galaxy.webp";
import cableCamo from "@/assets/products/cable-camo.webp";
import cableLavender from "@/assets/products/cable-lavender.webp";
import cableRosegold from "@/assets/products/cable-rosegold.webp";

const colorVariants = [
  {
    id: "galaxy",
    name: "Galaxy",
    color: "bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500",
    image: cableGalaxy,
  },
  {
    id: "camo",
    name: "Outdoor Tough",
    color: "bg-gradient-to-br from-green-800 via-green-600 to-amber-700",
    image: cableCamo,
  },
  {
    id: "lavender",
    name: "Pastel Calm",
    color: "bg-gradient-to-br from-violet-300 via-purple-300 to-indigo-300",
    image: cableLavender,
  },
  {
    id: "rosegold",
    name: "Rose Gold Chic",
    color: "bg-gradient-to-br from-pink-300 via-rose-300 to-pink-400",
    image: cableRosegold,
  },
];

const features = [
  { icon: Zap, text: "Fast Charging 3.0A" },
  { icon: Cable, text: "3-in-1 Magnetic Tips" },
  { icon: Shield, text: "LED Indicator Light" },
];

const MagneticCableProduct = () => {
  const [selectedColor, setSelectedColor] = useState(colorVariants[0]);

  const handleAddToCart = () => {
    toast.success(`Magnetic Cable (${selectedColor.name}) added to cart!`, {
      description: "Continue shopping or checkout now.",
      action: {
        label: "View Cart",
        onClick: () => console.log("Navigate to cart"),
      },
    });
  };

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Image & Color Selection */}
          <div className="relative">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-secondary/50 border border-border">
              <img
                src={selectedColor.image}
                alt={`Magnetic Charging Cable - ${selectedColor.name}`}
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
            
            {/* Color Selection - Under Image */}
            <div className="mt-4 p-4 bg-card rounded-xl border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3 text-center">
                Color: <span className="text-primary">{selectedColor.name}</span>
              </h3>
              <div className="flex justify-center gap-3">
                {colorVariants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedColor(variant)}
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
          <div className="flex flex-col">
            {/* Category */}
            <p className="text-primary font-medium uppercase tracking-wider text-sm mb-2">
              Premium Cables
            </p>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Magnetic Charging Cable
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                ))}
              </div>
              <span className="text-muted-foreground text-sm">(248 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-3xl font-bold text-foreground">$24.99</span>
              <span className="text-xl text-muted-foreground line-through">$39.99</span>
              <span className="bg-primary/20 text-primary text-sm font-semibold px-2 py-0.5 rounded">
                -38%
              </span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-8">
              Premium 3-in-1 magnetic charging cable with interchangeable tips for USB-C, 
              Micro USB, and Lightning devices. Features LED indicator and fast charging support.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-4 mb-8">
              {features.map((feature) => (
                <div
                  key={feature.text}
                  className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-lg"
                >
                  <feature.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="xl">
                Buy Now
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                Free Shipping
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                30-Day Returns
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                1-Year Warranty
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MagneticCableProduct;
