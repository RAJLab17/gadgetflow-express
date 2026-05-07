import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import WirelessCharger3in1Product from "@/components/WirelessCharger3in1Product";
import ProductDetailsAccordion from "@/components/ProductDetailsAccordion";
import Footer from "@/components/Footer";
import SeoTags from "@/components/SeoTags";
import { useViewContent } from "@/hooks/useViewContent";

const WirelessChargerPage = () => {
  useViewContent({
    content_name: "RAJ NEXUS 3-in-1 Wireless Charger",
    content_ids: ["raj-nexus"],
    content_category: "Wireless Charger",
    value: 99,
  });
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
      <SeoTags
        title="RAJ NEXUS 3-in-1 Wireless Charger - RAJ"
        description="RAJ NEXUS - Qi2 zertifizierte 3-in-1 MagSafe Ladestation mit 25W Schnellladen. Faltbares Design für iPhone, Apple Watch und AirPods."
        canonical="https://raj.ch/product/wireless-charger-3in1"
      />

      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div id="product">
            <WirelessCharger3in1Product />
          </div>
          <ProductDetailsAccordion />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default WirelessChargerPage;
