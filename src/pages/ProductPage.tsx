import Header from "@/components/Header";
import MagneticCableProduct from "@/components/MagneticCableProduct";
import Footer from "@/components/Footer";
import SeoTags from "@/components/SeoTags";
import { useViewContent } from "@/hooks/useViewContent";

const ProductPage = () => {
  useViewContent({
    content_name: "Magnetic Charging Cable",
    content_ids: ["magnetic-cable"],
    content_category: "Charging Cable",
  });
  return (
    <>
      <SeoTags
        title="Magnetic Charging Cable - RAJTech"
        description="Premium 3-in-1 magnetic charging cable with interchangeable tips. Fast charging, LED indicator, multiple colors available."
        canonical="https://raj.ch/product/magnetic-cable"
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
