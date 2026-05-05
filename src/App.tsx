import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useCartSync } from "@/hooks/useCartSync";
import LaunchPage from "./pages/LaunchPage";
import DevModeToggle from "./components/DevModeToggle";

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
const DokumentePage = lazy(() => import("./pages/DokumentePage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BesterWirelessChargerPage = lazy(() => import("./pages/BesterWirelessChargerPage"));
const KabellosesLadenBueroPage = lazy(() => import("./pages/KabellosesLadenBueroPage"));
const KabellosesLadenFirmenPage = lazy(() => import("./pages/KabellosesLadenFirmenPage"));
const MetaCapiStatusPage = lazy(() => import("./pages/MetaCapiStatusPage"));
const IphoneStandbyPage = lazy(() => import("./pages/IphoneStandbyPage"));
const MagSafeLadestationPage = lazy(() => import("./pages/MagSafeLadestationPage"));
const ThreeInOnePage = lazy(() => import("./pages/ThreeInOnePage"));
const SeoCheckPage = lazy(() => import("./pages/SeoCheckPage"));
const Beste3in1ChargerPage = lazy(() => import("./pages/Beste3in1ChargerPage"));
const MockupDarkPage = lazy(() => import("./pages/MockupDarkPage"));
const MockupShopPage = lazy(() => import("./pages/MockupShopPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Cart sync only runs on routes that actually need a cart (shop / product pages),
// NOT on the Launch Page where it would needlessly drag the Shopify vendor chunk
// into the LCP critical path.
const ShopCartSync = () => {
  useCartSync();
  return null;
};

// Startseite ist jetzt der Shop. ?mode=launch zeigt weiterhin die Launch Page.
const HomePage = () => {
  const [searchParams] = useSearchParams();
  if (searchParams.get("mode") === "launch") return <LaunchPage />;
  return (
    <Suspense fallback={null}>
      <ShopCartSync />
      <ShopPreview />
    </Suspense>
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
          <Suspense fallback={null}>
            <DevModeToggle />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/nexus" element={<MockupDarkPage />} />
              <Route path="/product/magnetic-cable" element={<WithCart><ProductPage /></WithCart>} />
              <Route path="/product/magsafe-powerbank" element={<WithCart><PowerBankPage /></WithCart>} />
              <Route path="/product/powerbank-ultra-20k" element={<WithCart><PowerBank20kPage /></WithCart>} />
              <Route path="/product/wireless-charger-3in1" element={<WithCart><WirelessChargerPage /></WithCart>} />
              <Route path="/product/foldable-charger" element={<WithCart><FoldableChargerPage /></WithCart>} />
              <Route path="/product/stand-charger-3in1" element={<WithCart><StandChargerPage /></WithCart>} />
              <Route path="/product/car-charger-4in1" element={<WithCart><CarChargerPage /></WithCart>} />
              <Route path="/product/gan-supercharger-100w" element={<WithCart><GanChargerPage /></WithCart>} />
              <Route path="/product/usb-charger-35w" element={<WithCart><UsbChargerPage /></WithCart>} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/agb" element={<AGBPage />} />
              <Route path="/datenschutz" element={<DatenschutzPage />} />
              <Route path="/impressum" element={<ImpressumPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/versand" element={<VersandPage />} />
              <Route path="/confirmed" element={<ConfirmedPage />} />
              <Route path="/launch" element={<LaunchPage />} />
              <Route path="/prelaunch" element={<LaunchPage />} />
              <Route path="/vergleich" element={<VergleichPage />} />
              <Route path="/qi2-erklaert" element={<Qi2ErklaertPage />} />
              <Route path="/ueber-raj" element={<UeberRajPage />} />
              <Route path="/shop" element={<WithCart><ShopPreview /></WithCart>} />
              <Route path="/shop-preview" element={<WithCart><ShopPreview /></WithCart>} />
              <Route path="/dokumente" element={<DokumentePage />} />
              <Route path="/manuals" element={<DokumentePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/bester-wireless-charger-schweiz" element={<BesterWirelessChargerPage />} />
              <Route path="/kabelloses-laden-buero-schweiz" element={<KabellosesLadenBueroPage />} />
              <Route path="/kabelloses-laden-firmen-schweiz" element={<KabellosesLadenFirmenPage />} />
              <Route path="/meta-capi-status" element={<MetaCapiStatusPage />} />
              <Route path="/iphone-standby-ladestation-schweiz" element={<IphoneStandbyPage />} />
              <Route path="/magsafe-ladestation-schweiz" element={<MagSafeLadestationPage />} />
              <Route path="/magsafe-ladestation" element={<Navigate to="/magsafe-ladestation-schweiz" replace />} />
              <Route path="/3-in-1-ladestation-iphone-apple-watch-airpods" element={<ThreeInOnePage />} />
              <Route path="/3in1-ladestation-iphone-apple-watch-airpods" element={<Navigate to="/3-in-1-ladestation-iphone-apple-watch-airpods" replace />} />
              <Route path="/seo-check" element={<SeoCheckPage />} />
              <Route path="/blog/bester-3in1-wireless-charger-schweiz-2026" element={<Beste3in1ChargerPage />} />
              <Route path="/mockup-dark" element={<MockupDarkPage />} />
              <Route path="/mockup-shop" element={<MockupShopPage />} />
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
