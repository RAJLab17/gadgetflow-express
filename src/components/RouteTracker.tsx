import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackMetaEvent } from "@/lib/meta-pixel";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fires Meta Pixel `PageView` and a GA4 `page_view` on every SPA route change.
 * The initial page views are already fired when the tracking scripts load,
 * so we skip the first mount to avoid double-counting.
 */
const RouteTracker = () => {
  const location = useLocation();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    trackMetaEvent("PageView");
    // GA4 page_view on route changes is sent by GA4 Enhanced Measurement
    // (browser history events). Sending it here too caused double hits.
  }, [location.pathname, location.search]);

  return null;
};

export default RouteTracker;
