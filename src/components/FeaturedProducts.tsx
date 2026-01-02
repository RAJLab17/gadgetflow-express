import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import earbudsImg from "@/assets/products/earbuds.jpg";
import phoneCaseImg from "@/assets/products/phone-case.jpg";
import phoneMountImg from "@/assets/products/phone-mount.jpg";
import cableGalaxyImg from "@/assets/products/cable-galaxy.png";
import screenProtectorImg from "@/assets/products/screen-protector.jpg";
import powerbankOrangeImg from "@/assets/products/powerbank-orange-1.png";
import charger3in1Img from "@/assets/products/charger-3in1-black-2.png";
import foldableChargerImg from "@/assets/products/charger-foldable-stand.webp";

const products = [
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
    id: 6,
    name: "ClearShield Screen Protector",
    price: 12,
    originalPrice: 19,
    image: screenProtectorImg,
    rating: 4,
    category: "Protection",
  },
];

const FeaturedProducts = () => {
  return (
    <section id="products" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="text-primary">Products</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore our best-selling smartphone accessories. Quality guaranteed.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            product.link ? (
              <Link key={product.id} to={product.link}>
                <ProductCard {...product} />
              </Link>
            ) : (
              <ProductCard key={product.id} {...product} />
            )
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
