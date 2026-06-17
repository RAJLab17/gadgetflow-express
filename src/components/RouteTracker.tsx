import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackMetaEvent } from "@/lib/meta-pixel";

/**
 * Fires Meta Pixel `PageView` on every SPA route change.
 * The initial PageView is already fired by index.html when the
 * pixel script finishes loading, so we skip the first mount to
 * avoid double-counting.
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
  }, [location.pathname, location.search]);

  return null;
};

export default RouteTracker;
