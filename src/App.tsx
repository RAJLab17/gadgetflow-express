import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useCartSync } from "@/hooks/useCartSync";
import LaunchPage from "./pages/LaunchPage";

// Lazy-load everything except the LaunchPage (the LCP route)
const Index = lazy(() => import("./pages/Index"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const PowerBankPage = lazy(() => import("./pages/PowerBankPage"));
const PowerBank20kPage = lazy(() => import("./pages/PowerBank20kPage"));
const WirelessChargerPage = lazy(() => import("./pages/WirelessChargerPage"));
const FoldableChargerPage = lazy(() => import("./pages/FoldableChargerPage"));
const StandChargerPage = lazy(() => import("./pages/StandChargerPage"));
const CarChargerPage = lazy(() => import("./pages/CarChargerPage"));
const GanChargerPage = lazy(() => import("./pages/GanChargerPage"));
const UsbChargerPage = lazy(() => import("./pages/UsbChargerPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const AGBPage = lazy(() => import("./pages/AGBPage"));
const DatenschutzPage = lazy(() => import("./pages/DatenschutzPage"));
const ImpressumPage = lazy(() => import("./pages/ImpressumPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const VersandPage = lazy(() => import("./pages/VersandPage"));
const ConfirmedPage = lazy(() => import("./pages/ConfirmedPage"));
const VergleichPage = lazy(() => import("./pages/VergleichPage"));
const Qi2ErklaertPage = lazy(() => import("./pages/Qi2ErklaertPage"));
const UeberRajPage = lazy(() => import("./pages/UeberRajPage"));
const ShopPreview = lazy(() => import("./pages/ShopPreview"));
const MetaCapiStatusPage = lazy(() => import("./pages/MetaCapiStatusPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Cart sync only runs on routes that actually need a cart (shop / product pages),
// NOT on the Launch Page where it would needlessly drag the Shopify vendor chunk
// into the LCP critical path.
const ShopCartSync = () => {
  useCartSync();
  return null;
};

// ?mode=shop → Shop anzeigen, sonst Launch Page
const HomePage = () => {
  const [searchParams] = useSearchParams();
  return searchParams.get("mode") === "shop" ? (
    <Suspense fallback={null}>
      <ShopCartSync />
      <Index />
    </Suspense>
  ) : (
    <LaunchPage />
  );
};

// Wrap shop / product routes with cart sync
const WithCart = ({ children }: { children: React.ReactNode }) => (
  <>
    <ShopCartSync />
    {children}
  </>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
          <Suspense fallback={null}>
            <Routes>
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
              <Route path="/shop-preview" element={<ShopPreview />} />
              <Route path="/meta-capi-status" element={<MetaCapiStatusPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
