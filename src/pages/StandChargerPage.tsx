import Header from "@/components/Header";
import StandCharger3in1Product from "@/components/StandCharger3in1Product";
import Footer from "@/components/Footer";
import SeoTags from "@/components/SeoTags";
import { productJsonLd } from "@/lib/schemas";
import { useViewContent } from "@/hooks/useViewContent";

const CANONICAL = "https://raj.ch/product/stand-charger-3in1";
const TITLE = "Stand 3-in-1 Wireless Charger - RAJTech";
const DESC = "Premium 3-in-1 Stand Wireless Charger für iPhone, Apple Watch und AirPods. 15W Schnellladen, elegantes Design in 4 Farben.";

const StandChargerPage = () => {
  useViewContent({
    content_name: "Stand 3-in-1 Wireless Charger",
    content_ids: ["stand-3in1"],
    content_category: "Wireless Charger",
  });
  return (
    <>
      <SeoTags
        title={TITLE}
        description={DESC}
        canonical={CANONICAL}
        jsonLd={productJsonLd({ name: "RAJTech Stand 3-in-1 Wireless Charger", description: DESC, url: CANONICAL, sku: "stand-3in1", category: "Electronics > Chargers > Wireless Chargers" })}
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
