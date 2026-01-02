import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FoldableWirelessChargerProduct from "@/components/FoldableWirelessChargerProduct";

const FoldableChargerPage = () => {
  return (
    <>
      <Helmet>
        <title>RAJTech Foldable 3-in-1 Wireless Charger | MagSafe Ladestation</title>
        <meta 
          name="description" 
          content="Ultra-kompakte faltbare MagSafe Ladestation für iPhone, Apple Watch & AirPods. 15W Schnellladen, eloxiertes Aluminium, perfekt für unterwegs. Jetzt vorbestellen!" 
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
