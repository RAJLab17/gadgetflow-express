import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import WirelessCharger3in1Product from "@/components/WirelessCharger3in1Product";
import Footer from "@/components/Footer";

const WirelessChargerPage = () => {
  return (
    <>
      <Helmet>
        <title>3-in-1 Wireless Charger - RAJTech</title>
        <meta
          name="description"
          content="Qi2.2 zertifizierte 3-in-1 MagSafe Ladestation mit 25W Schnellladen. Faltbares Design für iPhone, Apple Watch und AirPods."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <WirelessCharger3in1Product />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default WirelessChargerPage;
