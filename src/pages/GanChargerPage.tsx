import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GanChargerProduct from "@/components/GanChargerProduct";
import SeoTags from "@/components/SeoTags";
import { productJsonLd } from "@/lib/schemas";
import { useViewContent } from "@/hooks/useViewContent";

const CANONICAL = "https://raj.ch/product/gan-supercharger-100w";
const TITLE = "RAJTech GaN SuperCharger 100W | 4-Port USB-C Schnellladegerät";
const DESC = "100W GaN III Multi-Port Ladegerät mit 3×USB-C + 1×USB-A. Lade Laptop, Smartphone & Tablet gleichzeitig. PD 3.0, QC 4.0+ – ultra-kompakt & effizient.";

const GanChargerPage = () => {
  useViewContent({
    content_name: "GaN SuperCharger 100W",
    content_ids: ["gan-100w"],
    content_category: "Charger",
  });
  return (
    <>
      <SeoTags
        title={TITLE}
        description={DESC}
        canonical={CANONICAL}
        noindex
        jsonLd={productJsonLd({ name: "RAJTech GaN SuperCharger 100W", description: DESC, url: CANONICAL, sku: "gan-100w", category: "Electronics > Chargers > USB Chargers" })}
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <GanChargerProduct />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default GanChargerPage;
