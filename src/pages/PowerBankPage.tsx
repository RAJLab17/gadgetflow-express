import Header from "@/components/Header";
import MagSafePowerBankProduct from "@/components/MagSafePowerBankProduct";
import Footer from "@/components/Footer";
import SeoTags from "@/components/SeoTags";
import { useViewContent } from "@/hooks/useViewContent";

const PowerBankPage = () => {
  useViewContent({
    content_name: "MagSafe PowerBank Pro 10K",
    content_ids: ["magsafe-powerbank-10k"],
    content_category: "PowerBank",
  });
  return (
    <>
      <SeoTags
        title="MagSafe PowerBank Pro - RAJTech Bestseller"
        description="Unser meistverkauftes Produkt: MagSafe PowerBank Pro mit 10.000mAh, 15W Schnellladung und integriertem Ständer. In 4 Farben erhältlich."
        canonical="https://raj.ch/product/magsafe-powerbank"
      />

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
