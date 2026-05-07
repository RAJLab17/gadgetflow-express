import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarChargerProduct from "@/components/CarChargerProduct";
import SeoTags from "@/components/SeoTags";
import { useViewContent } from "@/hooks/useViewContent";

const CarChargerPage = () => {
  useViewContent({
    content_name: "Car Charger 4-in-1 Pro 100W",
    content_ids: ["car-charger-4in1"],
    content_category: "Car Charger",
  });
  return (
    <>
      <SeoTags
        title="RAJTech Car Charger 4-in-1 Pro | 100W mit einziehbaren Kabeln"
        description="Schluss mit Kabelsalat! Der RAJTech Car Charger 4-in-1 Pro mit 100W, einziehbaren Kabeln und Digital Display. Die clevere 4-in-1 Ladelösung fürs Auto."
        canonical="https://raj.ch/product/car-charger-4in1"
      />
      <Header />
      <CarChargerProduct />
      <Footer />
    </>
  );
};

export default CarChargerPage;
