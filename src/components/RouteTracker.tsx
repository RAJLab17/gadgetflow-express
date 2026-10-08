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
    // Exactly one GA4 page_view per route change. GA4's automatic history
    // page_views are off because config uses send_page_view: false.
    window.gtag?.("event", "page_view", {
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);

  return null;
};

export default RouteTracker;
