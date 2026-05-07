import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GanChargerProduct from "@/components/GanChargerProduct";
import SeoTags from "@/components/SeoTags";
import { useViewContent } from "@/hooks/useViewContent";

const GanChargerPage = () => {
  useViewContent({
    content_name: "GaN SuperCharger 100W",
    content_ids: ["gan-100w"],
    content_category: "Charger",
  });
  return (
    <>
      <SeoTags
        title="RAJTech GaN SuperCharger 100W | 4-Port USB-C Schnellladegerät"
        description="100W GaN III Multi-Port Ladegerät mit 3×USB-C + 1×USB-A. Lade Laptop, Smartphone & Tablet gleichzeitig. PD 3.0, QC 4.0+ – ultra-kompakt & effizient."
        canonical="https://raj.ch/product/gan-supercharger-100w"
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
