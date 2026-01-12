import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BrandMission from "@/components/BrandMission";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>RAJTech - Premium Smartphone Accessories</title>
        <meta
          name="description"
          content="Discover premium smartphone accessories at RAJTech. Shop earbuds, cases, chargers, cables and more. Fast delivery, quality guaranteed."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <FeaturedProducts />
          <BrandMission />
          <Categories />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
