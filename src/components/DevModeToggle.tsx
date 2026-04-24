import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

/**
 * Dev-only floating toggle to switch between Launch Page and Shop view.
 * Only renders on lovable.app / lovable.dev preview hosts — never on raj.ch.
 */
const DevModeToggle = () => {
  const [allowed, setAllowed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const host = window.location.hostname;
    const isLovable =
      host.endsWith("lovable.app") ||
      host.endsWith("lovable.dev") ||
      host === "localhost" ||
      host === "127.0.0.1";
    setAllowed(isLovable);
  }, []);

  if (!allowed) return null;

  const isShopMode = location.pathname === "/shop-preview";

  const goToLaunch = () => navigate("/", { replace: false });
  const goToShop = () => navigate("/shop-preview", { replace: false });

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2 rounded-full border border-border/60 bg-background/90 px-3 py-2 shadow-elegant backdrop-blur-xl">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Dev
      </span>
      <button
        onClick={goToLaunch}
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          !isShopMode
            ? "bg-primary text-primary-foreground"
            : "text-foreground/70 hover:text-foreground"
        }`}
      >
        Launch
      </button>
      <button
        onClick={goToShop}
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          isShopMode
            ? "bg-primary text-primary-foreground"
            : "text-foreground/70 hover:text-foreground"
        }`}
      >
        Shop
      </button>
    </div>
  );
};

export default DevModeToggle;
