import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />
            <Route path="/product/magnetic-cable" element={<ProductPage />} />
            <Route path="/product/magsafe-powerbank" element={<PowerBankPage />} />
            <Route path="/product/powerbank-ultra-20k" element={<PowerBank20kPage />} />
            <Route path="/product/wireless-charger-3in1" element={<WirelessChargerPage />} />
            <Route path="/product/foldable-charger" element={<FoldableChargerPage />} />
            <Route path="/product/stand-charger-3in1" element={<StandChargerPage />} />
            <Route path="/product/car-charger-4in1" element={<CarChargerPage />} />
            <Route path="/product/gan-supercharger-100w" element={<GanChargerPage />} />
            <Route path="/product/usb-charger-35w" element={<UsbChargerPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
