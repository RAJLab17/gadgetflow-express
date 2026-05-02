import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PowerBank20kProduct from "@/components/PowerBank20kProduct";
import { useViewContent } from "@/hooks/useViewContent";

const PowerBank20kPage = () => {
  useViewContent({
    content_name: "PowerBank Ultra 20K",
    content_ids: ["powerbank-20k"],
    content_category: "PowerBank",
  });
  return (
    <>
      <Helmet>
        <title>PowerBank Ultra 20K mit Fast-Charging PD3.0 | RAJTech</title>
        <meta
          name="description"
          content="20.000mAh PowerBank mit Fast-Charging PD3.0 bis 22.5W und 4 integrierten Kabeln. Nie wieder Kabelsalat – jetzt sichern mit 15% Rabatt."
        />
      </Helmet>
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
