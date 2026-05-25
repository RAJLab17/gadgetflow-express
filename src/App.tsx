import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useCartSync } from "@/hooks/useCartSync";
import DevModeToggle from "./components/DevModeToggle";

const LaunchPage = lazy(() => import("./pages/LaunchPage"));
const Index = lazy(() => import("./pages/Index"));
const ShopPreview = lazy(() => import("./pages/ShopPreview"));
const NexusPage = lazy(() => import("./pages/NexusPage"));
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
const DokumentePage = lazy(() => import("./pages/DokumentePage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BesterWirelessChargerPage = lazy(() => import("./pages/BesterWirelessChargerPage"));
const KabellosesLadenBueroPage = lazy(() => import("./pages/KabellosesLadenBueroPage"));
const KabellosesLadenFirmenPage = lazy(() => import("./pages/KabellosesLadenFirmenPage"));
const IphoneStandbyPage = lazy(() => import("./pages/IphoneStandbyPage"));
const MagSafeLadestationPage = lazy(() => import("./pages/MagSafeLadestationPage"));
const ThreeInOnePage = lazy(() => import("./pages/ThreeInOnePage"));
const Beste3in1ChargerPage = lazy(() => import("./pages/Beste3in1ChargerPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const ShopCartSync = () => {
  useCartSync();
  return null;
};

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
                <Route path="/shop" element={<ShopPreview />} />
                <Route path="/nexus" element={<NexusPage />} />
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
                <Route path="/dokumente" element={<DokumentePage />} />
                <Route path="/manuals" element={<DokumentePage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/bester-wireless-charger-schweiz" element={<BesterWirelessChargerPage />} />
                <Route path="/kabelloses-laden-buero-schweiz" element={<KabellosesLadenBueroPage />} />
                <Route path="/kabelloses-laden-firmen-schweiz" element={<KabellosesLadenFirmenPage />} />
                <Route path="/iphone-standby-ladestation-schweiz" element={<IphoneStandbyPage />} />
                <Route path="/magsafe-ladestation-schweiz" element={<MagSafeLadestationPage />} />
                <Route path="/magsafe-ladestation" element={<Navigate to="/magsafe-ladestation-schweiz" replace />} />
                <Route path="/3-in-1-ladestation-iphone-apple-watch-airpods" element={<ThreeInOnePage />} />
                <Route path="/3in1-ladestation-iphone-apple-watch-airpods" element={<Navigate to="/3-in-1-ladestation-iphone-apple-watch-airpods" replace />} />
                <Route path="/blog/bester-3in1-wireless-charger-schweiz-2026" element={<Beste3in1ChargerPage />} />
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
