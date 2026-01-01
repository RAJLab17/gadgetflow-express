import { Headphones, Shield, Battery, Cable, Smartphone, Settings } from "lucide-react";

const categories = [
  { icon: Headphones, name: "Audio", count: 45 },
  { icon: Shield, name: "Protection", count: 82 },
  { icon: Battery, name: "Charging", count: 56 },
  { icon: Cable, name: "Cables", count: 34 },
  { icon: Smartphone, name: "Stands", count: 28 },
  { icon: Settings, name: "Accessories", count: 67 },
];

const Categories = () => {
  return (
    <section id="categories" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shop by <span className="text-primary">Category</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Find exactly what you need for your smartphone
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <a
              key={category.name}
              href="#"
              className="group flex flex-col items-center p-6 bg-card rounded-xl border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_hsl(var(--primary)/0.15)] hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                <category.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-xs text-muted-foreground">{category.count} items</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
