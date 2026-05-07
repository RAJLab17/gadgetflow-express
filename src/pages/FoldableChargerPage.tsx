import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FoldableWirelessChargerProduct from "@/components/FoldableWirelessChargerProduct";
import ProductDetailsAccordion from "@/components/ProductDetailsAccordion";
import SeoTags from "@/components/SeoTags";
import { useViewContent } from "@/hooks/useViewContent";

const FoldableChargerPage = () => {
  useViewContent({
    content_name: "Foldable 3-in-1 Wireless Charger",
    content_ids: ["foldable-3in1"],
    content_category: "Wireless Charger",
  });
  return (
    <>
      <SeoTags
        title="RAJTech Foldable 3-in-1 Wireless Charger | MagSafe Ladestation"
        description="Ultra-kompakte faltbare MagSafe Ladestation für iPhone, Apple Watch & AirPods. 15W Schnellladen, eloxiertes Aluminium, perfekt für unterwegs. Jetzt sichern!"
        canonical="https://raj.ch/product/foldable-charger"
      />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main>
          <FoldableWirelessChargerProduct />
          <ProductDetailsAccordion />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default FoldableChargerPage;
