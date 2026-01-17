import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import earbudsImg from "@/assets/products/earbuds.jpg";
import phoneCaseImg from "@/assets/products/phone-case.jpg";
import phoneMountImg from "@/assets/products/phone-mount.jpg";
import cableGalaxyImg from "@/assets/products/cable-galaxy.png";
import screenProtectorImg from "@/assets/products/screen-protector.jpg";
import powerbankOrangeImg from "@/assets/products/powerbank-orange-1.png";
import charger3in1Img from "@/assets/products/charger-3in1-black-2.png";
import foldableChargerImg from "@/assets/products/charger-foldable-stand.webp";
import standChargerImg from "@/assets/products/charger-stand-hero.png";
import powerbank20kBlackImg from "@/assets/products/powerbank-20k-black.png";
import carChargerImg from "@/assets/products/car-charger-3.png";
import ganChargerImg from "@/assets/products/gan-charger-1.png";
import usbChargerImg from "@/assets/products/usb-charger-devices.png";

const products = [
  {
    id: 9,
    name: "Stand 3-in-1 Wireless Charger",
    price: 53.99,
    originalPrice: 59.99,
    image: standChargerImg,
    rating: 5,
    category: "3-in-1",
    link: "/product/stand-charger-3in1",
  },
  {
    id: 1,
    name: "MagSafe PowerBank Pro",
    price: 49,
    originalPrice: 79,
    image: powerbankOrangeImg,
    rating: 5,
    category: "Bestseller",
    link: "/product/magsafe-powerbank",
  },
  {
    id: 11,
    name: "Car Charger 4-in-1 Pro",
    price: 42.45,
    originalPrice: 49.95,
    image: carChargerImg,
    rating: 5,
    category: "NEU",
    link: "/product/car-charger-4in1",
  },
  {
    id: 10,
    name: "PowerBank Ultra 20K",
    price: 50.15,
    originalPrice: 59,
    image: powerbank20kBlackImg,
    rating: 5,
    category: "NEU",
    link: "/product/powerbank-ultra-20k",
  },
  {
    id: 7,
    name: "3-in-1 Wireless Charger",
    price: 69,
    originalPrice: 99,
    image: charger3in1Img,
    rating: 5,
    category: "NEU",
    link: "/product/wireless-charger-3in1",
  },
  {
    id: 13,
    name: "USB-C Schnellladegerät 65W",
    price: 33.99,
    originalPrice: 39.99,
    image: usbChargerImg,
    rating: 5,
    category: "NEU",
    link: "/product/usb-charger-35w",
  },
  {
    id: 12,
    name: "GaN SuperCharger 100W",
    price: 67.15,
    originalPrice: 79,
    image: ganChargerImg,
    rating: 5,
    category: "NEU",
    link: "/product/gan-supercharger-100w",
  },
  {
    id: 8,
    name: "Foldable 3-in-1 Charger",
    price: 49,
    originalPrice: 59,
    image: foldableChargerImg,
    rating: 5,
    category: "Portabel",
    link: "/product/foldable-charger",
  },
  {
    id: 5,
    name: "Magnetic Charging Cable",
    price: 25,
    originalPrice: 40,
    image: cableGalaxyImg,
    rating: 5,
    category: "Cables",
    link: "/product/magnetic-cable",
  },
  {
    id: 2,
    name: "ProSound Wireless Earbuds",
    price: 49,
    originalPrice: 79,
    image: earbudsImg,
    rating: 5,
    category: "Audio",
  },
  {
    id: 3,
    name: "Ultra Slim Phone Case",
    price: 24,
    originalPrice: 35,
    image: phoneCaseImg,
    rating: 4,
    category: "Protection",
  },
  {
    id: 4,
    name: "MagGrip Car Mount",
    price: 29,
    image: phoneMountImg,
    rating: 4,
    category: "Mounts",
  },
  {
    id: 6,
    name: "ClearShield Screen Protector",
    price: 12,
    originalPrice: 19,
    image: screenProtectorImg,
    rating: 4,
    category: "Protection",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const FeaturedProducts = () => {
  return (
    <section id="products" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
            Unsere Produkte
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Premium <span className="text-primary">Qualität</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Entdecke unsere meistverkauften Smartphone-Accessoires. Qualität garantiert.
          </p>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              {product.link ? (
                <Link to={product.link} className="block">
                  <ProductCard {...product} />
                </Link>
              ) : (
                <ProductCard {...product} />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <Button variant="outline" size="lg" className="group border-primary/30 hover:border-primary hover:bg-primary/5">
            Alle Produkte anzeigen
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
