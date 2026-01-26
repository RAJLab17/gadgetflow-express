import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import charger3in1Img from "@/assets/products/charger-3in1-black-2.png";

const product = {
  id: 7,
  name: "3-in-1 Wireless Charger",
  price: 62.10,
  originalPrice: 69,
  image: charger3in1Img,
  rating: 5,
  category: "Premium Collection",
  link: "/product/wireless-charger-3in1",
  description: "Lade iPhone, Apple Watch und AirPods gleichzeitig mit bis zu 25W – elegant und kompakt.",
};

const FeaturedProducts = () => {
  return (
    <section id="products" className="py-24 md:py-32 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-primary text-sm font-semibold uppercase tracking-[0.2em] mb-6">
            Unser Flaggschiff
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Perfekte <span className="text-primary">Eleganz</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Entworfen für höchste Ansprüche. Qualität, die man sieht und fühlt.
          </p>
        </motion.div>

        {/* Featured Product Display */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <Link to={product.link} className="block group">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Product Image */}
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-secondary to-muted shadow-elegant-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="absolute -top-4 -right-4 px-6 py-3 bg-primary text-primary-foreground rounded-2xl shadow-elegant font-semibold text-sm"
                >
                  -10% Vorbesteller
                </motion.div>
              </motion.div>

              {/* Product Info */}
              <div className="space-y-8">
                <div>
                  <span className="text-primary text-sm font-semibold uppercase tracking-[0.15em] mb-3 block">
                    {product.category}
                  </span>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight group-hover:text-primary transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-primary fill-primary"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-muted-foreground text-sm">(89 Bewertungen)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl md:text-5xl font-bold text-primary">
                    CHF {product.price.toFixed(2)}
                  </span>
                  <span className="text-xl text-muted-foreground line-through">
                    CHF {product.originalPrice.toFixed(2)}
                  </span>
                </div>

                {/* CTA */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block"
                >
                  <span className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg shadow-elegant group-hover:shadow-elegant-lg transition-all duration-300">
                    Jetzt vorbestellen
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                </motion.div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
                  {[
                    { label: "Qi2.2", sublabel: "Zertifiziert" },
                    { label: "25W", sublabel: "Schnellladen" },
                    { label: "3-in-1", sublabel: "All-in-One" },
                  ].map((feature, index) => (
                    <div key={index} className="text-center">
                      <p className="text-2xl font-bold text-foreground">{feature.label}</p>
                      <p className="text-sm text-muted-foreground">{feature.sublabel}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
