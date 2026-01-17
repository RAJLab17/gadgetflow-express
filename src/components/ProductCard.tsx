import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  category: string;
}

const ProductCard = ({ name, price, originalPrice, image, rating, category }: ProductCardProps) => {
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`${name} zum Warenkorb hinzugefügt!`, {
      description: "Weiter einkaufen oder zur Kasse gehen.",
      action: {
        label: "Warenkorb",
        onClick: () => console.log("Navigate to cart"),
      },
    });
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative bg-card rounded-2xl border border-border overflow-hidden"
    >
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/30 transition-all duration-500" />
      
      {/* Discount Badge */}
      {discount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
        >
          -{discount}%
        </motion.div>
      )}

      {/* Category Badge */}
      <div className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm text-foreground text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border border-border">
        {category}
      </div>

      {/* Image Container */}
      <div className="relative aspect-square bg-gradient-to-b from-secondary/30 to-secondary/10 overflow-hidden">
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Button variant="glow" size="lg" onClick={handleAddToCart} className="shadow-2xl">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Hinzufügen
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 relative">
        <h3 className="font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300 text-base">
          {name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i < rating ? 'text-primary fill-primary' : 'text-muted'}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-2">({rating}.0)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-foreground">€{price}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">€{originalPrice}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
