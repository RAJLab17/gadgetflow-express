import Header from "@/components/Header";
import MagSafePowerBankProduct from "@/components/MagSafePowerBankProduct";
import Footer from "@/components/Footer";
import SeoTags from "@/components/SeoTags";
import { productJsonLd } from "@/lib/schemas";
import { useViewContent } from "@/hooks/useViewContent";

const CANONICAL = "https://raj.ch/product/magsafe-powerbank";
const TITLE = "MagSafe PowerBank Pro - RAJTech Bestseller";
const DESC = "Unser meistverkauftes Produkt: MagSafe PowerBank Pro mit 10.000mAh, 15W Schnellladung und integriertem Ständer. In 4 Farben erhältlich.";

const PowerBankPage = () => {
  useViewContent({
    content_name: "MagSafe PowerBank Pro 10K",
    content_ids: ["magsafe-powerbank-10k"],
    content_category: "PowerBank",
  });
  return (
    <>
      <SeoTags
        title={TITLE}
        description={DESC}
        canonical={CANONICAL}
        noindex
        jsonLd={productJsonLd({ name: "RAJTech MagSafe PowerBank Pro 10K", description: DESC, url: CANONICAL, sku: "magsafe-powerbank-10k", category: "Electronics > Power Banks" })}
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
