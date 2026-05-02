import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GanChargerProduct from "@/components/GanChargerProduct";
import { useViewContent } from "@/hooks/useViewContent";

const GanChargerPage = () => {
  useViewContent({
    content_name: "GaN SuperCharger 100W",
    content_ids: ["gan-100w"],
    content_category: "Charger",
  });
  return (
    <>
      <Helmet>
        <title>RAJTech GaN SuperCharger 100W | 4-Port USB-C Schnellladegerät</title>
        <meta
          name="description"
          content="100W GaN III Multi-Port Ladegerät mit 3×USB-C + 1×USB-A. Lade Laptop, Smartphone & Tablet gleichzeitig. PD 3.0, QC 4.0+ – ultra-kompakt & effizient."
        />
        <meta
          name="keywords"
          content="GaN Charger, 100W Ladegerät, USB-C Charger, Fast Charging, Laptop Charger, Multi Port, PD 3.0, Gaming Laptop"
        />
      </Helmet>
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
