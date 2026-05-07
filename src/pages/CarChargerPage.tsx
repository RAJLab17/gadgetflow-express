import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarChargerProduct from "@/components/CarChargerProduct";
import SeoTags from "@/components/SeoTags";
import { productJsonLd } from "@/lib/schemas";
import { useViewContent } from "@/hooks/useViewContent";

const CANONICAL = "https://raj.ch/product/car-charger-4in1";
const TITLE = "RAJTech Car Charger 4-in-1 Pro | 100W mit einziehbaren Kabeln";
const DESC = "Schluss mit Kabelsalat! Der RAJTech Car Charger 4-in-1 Pro mit 100W, einziehbaren Kabeln und Digital Display. Die clevere 4-in-1 Ladelösung fürs Auto.";

const CarChargerPage = () => {
  useViewContent({
    content_name: "Car Charger 4-in-1 Pro 100W",
    content_ids: ["car-charger-4in1"],
    content_category: "Car Charger",
  });
  return (
    <>
      <SeoTags
        title={TITLE}
        description={DESC}
        canonical={CANONICAL}
        noindex
        jsonLd={productJsonLd({ name: "RAJTech Car Charger 4-in-1 Pro 100W", description: DESC, url: CANONICAL, sku: "car-charger-4in1", category: "Electronics > Chargers > Car Chargers" })}
      />
      <Header />
      <CarChargerProduct />
      <Footer />
    </>
  );
};

export default CarChargerPage;
