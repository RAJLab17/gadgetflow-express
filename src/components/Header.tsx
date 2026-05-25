import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo-new.webp";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isMobileSupportOpen, setIsMobileSupportOpen] = useState(false);
  const supportCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();
  const isDarkPage = location.pathname === "/" || location.pathname.startsWith("/about");

  const supportLinks = [
    { label: t("header.faq"), href: "/faq" },
    { label: t("header.shipping"), href: "/versand" },
    { label: t("header.contact"), href: "#" },
    { label: t("header.manuals"), href: "#" },
  ];

  useEffect(() => {
    let raf = 0;
    const handleScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        // Hysteresis: avoid flicker around the threshold
        setIsScrolled((prev) => (prev ? y > 8 : y > 40));
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);


  useEffect(() => {
    return () => {
      if (supportCloseTimer.current) clearTimeout(supportCloseTimer.current);
    };
  }, []);

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      if (window.location.pathname !== "/") {
        window.location.href = "/" + href;
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
    setIsMenuOpen(false);
  };

  const startSupportClose = () => {
    supportCloseTimer.current = setTimeout(() => {
      setIsSupportOpen(false);
    }, 500);
  };

  const cancelSupportClose = () => {
    if (supportCloseTimer.current) {
      clearTimeout(supportCloseTimer.current);
      supportCloseTimer.current = null;
    }
  };

  const handleSupportEnter = () => {
    cancelSupportClose();
    setIsSupportOpen(true);
  };

  const handleSupportLeave = () => {
    startSupportClose();
  };

  const LanguageToggle = () => (
    <div className="flex items-center gap-1 text-xs font-medium">
      {(["de", "fr", "it", "en"] as const).map((code, i) => (
        <span key={code} className="flex items-center gap-1">
          {i > 0 && <span className="text-muted-foreground/40">|</span>}
          <button
            onClick={() => setLang(code)}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              lang === code ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {code.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );

  return (
    <header
      className={`raj-slide-down fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-xl shadow-elegant border-b border-border/50"
          : "bg-transparent"
      } ${isDarkPage && !isScrolled ? "[&_*]:!text-white" : ""}`}
    >
      <div className="w-full px-2 sm:px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="https://raj.ch" className="flex items-center gap-2 shrink-0 -ml-2 sm:-ml-1" aria-label="RAJ Home">
            <img
              src={logo}
              alt="RAJ Logo"
              width={180}
              height={56}
              fetchPriority="high"
              decoding="async"
              className="h-8 sm:h-12 w-auto select-none"
              style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.42))" }}
              draggable={false}
            />
            <span className="hidden sm:block text-sm font-medium text-foreground/70 tracking-wide">
              Power. Always There.
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            <button
              onClick={() => handleNavClick("#products")}
              className="relative text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-300 group"
            >
              {t("header.product")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </button>

            <button
              onClick={() => handleNavClick("#ecosystem")}
              className="relative text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-300 group"
            >
              Ecosystem
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </button>

            <Link
              to="/blog"
              className="relative text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-300 group"
            >
              Blog
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>

            <Link
              to="/faq"
              className="relative text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-300 group"
            >
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>

            <Link
              to="/about"
              className="relative text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-300 group"
            >
              {t("header.about")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <CartDrawer />
            <Button
              variant="hero"
              size="default"
              className="shadow-elegant"
              onClick={() => handleNavClick("#products")}
            >
              {t("header.buy")}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <CartDrawer />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-foreground hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu — pure CSS expand */}
        {isMenuOpen && (
          <div
            className="raj-fade md:hidden overflow-hidden bg-[#0a0908]/98 backdrop-blur-xl border-t border-[#9b6b3f]/30 -mx-2 sm:-mx-4 px-6"
            style={{ animationDuration: "300ms" }}
          >
            <div className="py-6 space-y-1">
              {[
                { label: t("header.product"), action: () => handleNavClick("#products") },
                { label: "Ecosystem", action: () => handleNavClick("#ecosystem") },
                { label: "Blog", to: "/blog" },
                { label: "FAQ", to: "/faq" },
                { label: t("header.about"), to: "/about" },
              ].map((item, i) => (
                <div
                  key={item.label}
                  style={{ animation: `raj-slide-from-left 400ms ${i * 50}ms both` }}
                >
                  {item.to ? (
                    <Link
                      to={item.to}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between py-4 border-b border-white/10 !text-white text-base font-light tracking-wide hover:!text-[#c8946b] transition-colors"
                    >
                      <span>{item.label}</span>
                      <span style={{ color: "#9b6b3f" }}>→</span>
                    </Link>
                  ) : (
                    <button
                      onClick={item.action}
                      className="flex items-center justify-between w-full py-4 border-b border-white/10 !text-white text-base font-light tracking-wide hover:!text-[#c8946b] transition-colors text-left"
                    >
                      <span>{item.label}</span>
                      <span style={{ color: "#9b6b3f" }}>→</span>
                    </button>
                  )}
                </div>
              ))}

              <div className="pt-6 pb-2" style={{ animation: "raj-slide-from-left 400ms 300ms both" }}>
                <button
                  onClick={() => handleNavClick("#products")}
                  className="w-full py-4 rounded-full text-[11px] uppercase font-medium tracking-[0.28em] transition-all"
                  style={{
                    background: "#9b6b3f",
                    color: "#0a0908",
                    boxShadow: "0 14px 40px -12px #9b6b3f",
                  }}
                >
                  {t("header.buy")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
