import { motion } from "framer-motion";
import { Headphones, Shield, Battery, Cable, Smartphone, Settings } from "lucide-react";

const categories = [
  { icon: Headphones, name: "Audio", count: 45 },
  { icon: Shield, name: "Schutz", count: 82 },
  { icon: Battery, name: "Laden", count: 56 },
  { icon: Cable, name: "Kabel", count: 34 },
  { icon: Smartphone, name: "Halterungen", count: 28 },
  { icon: Settings, name: "Zubehör", count: 67 },
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
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const Categories = () => {
  return (
    <section id="categories" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-secondary/20 to-background" />
      
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
            Kategorien
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Finde dein <span className="text-primary">Produkt</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Entdecke genau das, was du für dein Smartphone brauchst
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
        >
          {categories.map((category) => (
            <motion.a
              key={category.name}
              href="#"
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="group relative flex flex-col items-center p-8 rounded-2xl bg-card/50 border border-border backdrop-blur-sm overflow-hidden"
            >
              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/30 transition-all duration-500" />
              
              {/* Icon Container */}
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="relative w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
              >
                <category.icon className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </motion.div>
              
              <h3 className="relative font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 text-center">
                {category.name}
              </h3>
              <p className="relative text-sm text-muted-foreground">
                {category.count} Artikel
              </p>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
