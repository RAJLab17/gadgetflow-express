import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import WirelessCharger3in1Product from "@/components/WirelessCharger3in1Product";
import Footer from "@/components/Footer";

const WirelessChargerPage = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [hash]);
  return (
    <>
      <Helmet>
        <title>RAJ NEXUS 3-in-1 Wireless Charger - RAJ</title>
        <meta
          name="description"
          content="RAJ NEXUS - Qi2 zertifizierte 3-in-1 MagSafe Ladestation mit 25W Schnellladen. Faltbares Design für iPhone, Apple Watch und AirPods."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div id="product">
            <WirelessCharger3in1Product />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default WirelessChargerPage;
