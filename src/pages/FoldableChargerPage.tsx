import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FoldableWirelessChargerProduct from "@/components/FoldableWirelessChargerProduct";
import { useViewContent } from "@/hooks/useViewContent";

const FoldableChargerPage = () => {
  useViewContent({
    content_name: "Foldable 3-in-1 Wireless Charger",
    content_ids: ["foldable-3in1"],
    content_category: "Wireless Charger",
  });
  return (
    <>
      <Helmet>
        <title>RAJTech Foldable 3-in-1 Wireless Charger | MagSafe Ladestation</title>
        <meta 
          name="description" 
          content="Ultra-kompakte faltbare MagSafe Ladestation für iPhone, Apple Watch & AirPods. 15W Schnellladen, eloxiertes Aluminium, perfekt für unterwegs. Jetzt sichern!" 
        />
        <meta name="keywords" content="MagSafe, Wireless Charger, Foldable, 3-in-1, iPhone Ladestation, Apple Watch Charger, AirPods, RAJTech" />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main>
          <FoldableWirelessChargerProduct />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default FoldableChargerPage;
