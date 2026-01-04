import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UsbChargerProduct from "@/components/UsbChargerProduct";

const UsbChargerPage = () => {
  return (
    <>
      <Helmet>
        <title>RAJTech USB-C Schnellladegerät 35W | 3× schneller laden</title>
        <meta 
          name="description" 
          content="RAJTech USB-C Schnellladegerät mit 35W Power Delivery. Dual-Port (USB-C + USB-A), lädt 2 Geräte gleichzeitig. Jetzt vorbestellen und 15% sparen!" 
        />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 pt-16">
          <UsbChargerProduct />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default UsbChargerPage;
