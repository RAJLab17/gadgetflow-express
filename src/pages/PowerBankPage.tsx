import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import MagSafePowerBankProduct from "@/components/MagSafePowerBankProduct";
import Footer from "@/components/Footer";

const PowerBankPage = () => {
  return (
    <>
      <Helmet>
        <title>MagSafe PowerBank Pro - RAJTech Bestseller</title>
        <meta
          name="description"
          content="Unser meistverkauftes Produkt: MagSafe PowerBank Pro mit 10.000mAh, 15W Schnellladung und integriertem Ständer. In 4 Farben erhältlich."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <MagSafePowerBankProduct />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PowerBankPage;
