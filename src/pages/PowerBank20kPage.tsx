import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PowerBank20kProduct from "@/components/PowerBank20kProduct";
import SeoTags from "@/components/SeoTags";
import { productJsonLd } from "@/lib/schemas";
import { useViewContent } from "@/hooks/useViewContent";

const CANONICAL = "https://raj.ch/product/powerbank-ultra-20k";
const TITLE = "PowerBank Ultra 20K mit Fast-Charging PD3.0 | RAJTech";
const DESC = "20.000mAh PowerBank mit Fast-Charging PD3.0 bis 22.5W und 4 integrierten Kabeln. Nie wieder Kabelsalat – jetzt sichern mit 15% Rabatt.";

const PowerBank20kPage = () => {
  useViewContent({
    content_name: "PowerBank Ultra 20K",
    content_ids: ["powerbank-20k"],
    content_category: "PowerBank",
  });
  return (
    <>
      <SeoTags
        title={TITLE}
        description={DESC}
        canonical={CANONICAL}
        jsonLd={productJsonLd({ name: "RAJTech PowerBank Ultra 20K", description: DESC, url: CANONICAL, sku: "powerbank-20k", category: "Electronics > Power Banks" })}
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <PowerBank20kProduct />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PowerBank20kPage;
