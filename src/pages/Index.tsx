import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import HeroBadgesAndCTA from "@/components/HeroBadgesAndCTA";
import VideoSection from "@/components/VideoSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>RAJ - Premium Wireless Charger</title>
        <meta
          name="description"
          content="RAJ 3-in-1 Wireless Charger – Premium Ladestation für iPhone, Apple Watch und AirPods. Elegantes Design, Schweizer Qualität."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroCarousel />
          <HeroBadgesAndCTA />
          <VideoSection />
          <FeaturedProducts />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
