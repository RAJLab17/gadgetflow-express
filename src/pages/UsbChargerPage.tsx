import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UsbChargerProduct from "@/components/UsbChargerProduct";
import SeoTags from "@/components/SeoTags";
import { useViewContent } from "@/hooks/useViewContent";

const UsbChargerPage = () => {
  useViewContent({
    content_name: "USB-C Schnellladegerät 65W",
    content_ids: ["usb-c-65w"],
    content_category: "Charger",
  });
  return (
    <>
      <SeoTags
        title="RAJTech USB-C Schnellladegerät 65W | 3× schneller laden"
        description="RAJTech USB-C Schnellladegerät mit 65W Power Delivery. Dual-Port (USB-C + USB-A), lädt 2 Geräte gleichzeitig. Jetzt sichern und 15% sparen!"
        canonical="https://raj.ch/product/usb-charger-35w"
      />
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
