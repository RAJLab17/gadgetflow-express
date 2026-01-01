import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import MagneticCableProduct from "@/components/MagneticCableProduct";
import Footer from "@/components/Footer";

const ProductPage = () => {
  return (
    <>
      <Helmet>
        <title>Magnetic Charging Cable - RAJTech</title>
        <meta
          name="description"
          content="Premium 3-in-1 magnetic charging cable with interchangeable tips. Fast charging, LED indicator, multiple colors available."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <MagneticCableProduct />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProductPage;
