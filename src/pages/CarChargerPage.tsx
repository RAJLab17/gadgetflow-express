import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarChargerProduct from "@/components/CarChargerProduct";
import { Helmet } from "react-helmet-async";

const CarChargerPage = () => {
  return (
    <>
      <Helmet>
        <title>RAJTech Car Charger 4-in-1 Pro | 100W mit einziehbaren Kabeln</title>
        <meta
          name="description"
          content="Schluss mit Kabelsalat! Der RAJTech Car Charger 4-in-1 Pro mit 100W, einziehbaren Kabeln und Digital Display. Die clevere 4-in-1 Ladelösung fürs Auto."
        />
      </Helmet>
      <Header />
      <CarChargerProduct />
      <Footer />
    </>
  );
};

export default CarChargerPage;
