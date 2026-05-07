import Header from "@/components/Header";
import MagneticCableProduct from "@/components/MagneticCableProduct";
import Footer from "@/components/Footer";
import SeoTags from "@/components/SeoTags";
import { productJsonLd } from "@/lib/schemas";
import { useViewContent } from "@/hooks/useViewContent";

const CANONICAL = "https://raj.ch/product/magnetic-cable";
const TITLE = "Magnetic Charging Cable - RAJTech";
const DESC = "Premium 3-in-1 magnetic charging cable with interchangeable tips. Fast charging, LED indicator, multiple colors available.";

const ProductPage = () => {
  useViewContent({
    content_name: "Magnetic Charging Cable",
    content_ids: ["magnetic-cable"],
    content_category: "Charging Cable",
  });
  return (
    <>
      <SeoTags
        title={TITLE}
        description={DESC}
        canonical={CANONICAL}
        noindex
        jsonLd={productJsonLd({ name: "RAJTech Magnetic Charging Cable", description: DESC, url: CANONICAL, sku: "magnetic-cable", category: "Electronics > Cables" })}
      />

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
