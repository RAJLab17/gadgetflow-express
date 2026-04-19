import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useCartSync } from "@/hooks/useCartSync";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import PowerBankPage from "./pages/PowerBankPage";
import PowerBank20kPage from "./pages/PowerBank20kPage";
import WirelessChargerPage from "./pages/WirelessChargerPage";
import FoldableChargerPage from "./pages/FoldableChargerPage";
import StandChargerPage from "./pages/StandChargerPage";
import CarChargerPage from "./pages/CarChargerPage";
import GanChargerPage from "./pages/GanChargerPage";
import UsbChargerPage from "./pages/UsbChargerPage";
import AboutPage from "./pages/AboutPage";
import AGBPage from "./pages/AGBPage";
import DatenschutzPage from "./pages/DatenschutzPage";
import ImpressumPage from "./pages/ImpressumPage";
import FAQPage from "./pages/FAQPage";
import VersandPage from "./pages/VersandPage";
import ConfirmedPage from "./pages/ConfirmedPage";
import LaunchPage from "./pages/LaunchPage";
import VergleichPage from "./pages/VergleichPage";
import Qi2ErklaertPage from "./pages/Qi2ErklaertPage";
import UeberRajPage from "./pages/UeberRajPage";
import ShopPreview from "./pages/ShopPreview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();
  return null;
};

// ?mode=shop → Shop anzeigen, sonst Launch Page
const HomePage = () => {
  const [searchParams] = useSearchParams();
  return searchParams.get("mode") === "shop" ? <Index /> : <LaunchPage />;
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
          <Routes>
          {/* Homepage: ?mode=shop zeigt Shop, sonst Launch Page */}
          <Route path="/" element={<HomePage />} />
            <Route path="/product/magnetic-cable" element={<ProductPage />} />
            <Route path="/product/magsafe-powerbank" element={<PowerBankPage />} />
            <Route path="/product/powerbank-ultra-20k" element={<PowerBank20kPage />} />
            <Route path="/product/wireless-charger-3in1" element={<WirelessChargerPage />} />
            <Route path="/product/foldable-charger" element={<FoldableChargerPage />} />
            <Route path="/product/stand-charger-3in1" element={<StandChargerPage />} />
            <Route path="/product/car-charger-4in1" element={<CarChargerPage />} />
            <Route path="/product/gan-supercharger-100w" element={<GanChargerPage />} />
            <Route path="/product/usb-charger-35w" element={<UsbChargerPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/agb" element={<AGBPage />} />
            <Route path="/datenschutz" element={<DatenschutzPage />} />
            <Route path="/impressum" element={<ImpressumPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/versand" element={<VersandPage />} />
            <Route path="/confirmed" element={<ConfirmedPage />} />
            <Route path="/launch" element={<LaunchPage />} />
            <Route path="/vergleich" element={<VergleichPage />} />
            <Route path="/qi2-erklaert" element={<Qi2ErklaertPage />} />
            <Route path="/ueber-raj" element={<UeberRajPage />} />
            {/* Hidden preview route — not linked anywhere, noindex */}
            <Route path="/shop-preview" element={<ShopPreview />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
