import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FoldableWirelessChargerProduct from "@/components/FoldableWirelessChargerProduct";
import ProductDetailsAccordion from "@/components/ProductDetailsAccordion";
import SeoTags from "@/components/SeoTags";
import { productJsonLd } from "@/lib/schemas";
import { useViewContent } from "@/hooks/useViewContent";

const CANONICAL = "https://raj.ch/product/foldable-charger";
const TITLE = "RAJTech Foldable 3-in-1 Wireless Charger | MagSafe Ladestation";
const DESC = "Ultra-kompakte faltbare MagSafe Ladestation für iPhone, Apple Watch & AirPods. 15W Schnellladen, eloxiertes Aluminium, perfekt für unterwegs. Jetzt sichern!";

const FoldableChargerPage = () => {
  useViewContent({
    content_name: "Foldable 3-in-1 Wireless Charger",
    content_ids: ["foldable-3in1"],
    content_category: "Wireless Charger",
  });
  return (
    <>
      <SeoTags
        title={TITLE}
        description={DESC}
        canonical={CANONICAL}
        jsonLd={productJsonLd({
          name: "RAJTech Foldable 3-in-1 Wireless Charger",
          description: DESC,
          url: CANONICAL,
          sku: "foldable-3in1",
          category: "Electronics > Chargers > Wireless Chargers",
        })}
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
