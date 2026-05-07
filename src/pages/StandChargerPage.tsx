import Header from "@/components/Header";
import StandCharger3in1Product from "@/components/StandCharger3in1Product";
import Footer from "@/components/Footer";
import SeoTags from "@/components/SeoTags";
import { useViewContent } from "@/hooks/useViewContent";

const StandChargerPage = () => {
  useViewContent({
    content_name: "Stand 3-in-1 Wireless Charger",
    content_ids: ["stand-3in1"],
    content_category: "Wireless Charger",
  });
  return (
    <>
      <SeoTags
        title="Stand 3-in-1 Wireless Charger - RAJTech"
        description="Premium 3-in-1 Stand Wireless Charger für iPhone, Apple Watch und AirPods. 15W Schnellladen, elegantes Design in 4 Farben."
        canonical="https://raj.ch/product/stand-charger-3in1"
      />

      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <StandCharger3in1Product />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default StandChargerPage;
