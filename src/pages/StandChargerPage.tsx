import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import StandCharger3in1Product from "@/components/StandCharger3in1Product";
import Footer from "@/components/Footer";

const StandChargerPage = () => {
  return (
    <>
      <Helmet>
        <title>Stand 3-in-1 Wireless Charger - RAJTech</title>
        <meta
          name="description"
          content="Premium 3-in-1 Stand Wireless Charger für iPhone, Apple Watch und AirPods. 15W Schnellladen, elegantes Design in 4 Farben."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <StandCharger3in1Product />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default StandChargerPage;
