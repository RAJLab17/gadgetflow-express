import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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

  const supportLinks = [
    { label: t("header.faq"), href: "/faq" },
    { label: t("header.shipping"), href: "/versand" },
    { label: t("header.contact"), href: "#" },
    { label: t("header.manuals"), href: "#" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      <button
        onClick={() => setLang("de")}
        className={`px-1.5 py-0.5 rounded transition-colors ${
          lang === "de" ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        DE
      </button>
      <span className="text-muted-foreground/40">|</span>
      <button
        onClick={() => setLang("fr")}
        className={`px-1.5 py-0.5 rounded transition-colors ${
          lang === "fr" ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        FR
      </button>
      <span className="text-muted-foreground/40">|</span>
      <button
        onClick={() => setLang("it")}
        className={`px-1.5 py-0.5 rounded transition-colors ${
          lang === "it" ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        IT
      </button>
    </div>
  );

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-xl shadow-elegant border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 -ml-1 sm:ml-0" aria-label="RAJ Home">
            <img
              src={logo}
              alt="RAJ Logo"
              width={180}
              height={56}
              fetchPriority="high"
              decoding="async"
              className="h-5 md:h-8 w-auto drop-shadow-sm select-none"
              draggable={false}
            />
            <span className="hidden sm:block text-sm font-medium text-foreground/70 tracking-wide">
              Power. Always There.
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            <button
              onClick={() => handleNavClick("#products")}
              className="relative text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-300 group"
            >
              {t("header.product")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </button>

            <Link
              to="/about"
              className="relative text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-300 group"
            >
              {t("header.about")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>

            <div
              className="relative"
              onMouseEnter={handleSupportEnter}
              onMouseLeave={handleSupportLeave}
            >
              <button
                onClick={() => setIsSupportOpen((prev) => !prev)}
                className="relative text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-300 group"
              >
                {t("header.support")}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </button>

              <AnimatePresence>
                {isSupportOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-card/95 backdrop-blur-xl border border-border/60 rounded-xl shadow-elegant-lg py-2 overflow-hidden"
                  >
                    {supportLinks.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setIsSupportOpen(false)}
                        className="block px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors duration-200"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <LanguageToggle />
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
            <LanguageToggle />
            <CartDrawer />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-foreground hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-border/50"
            >
              <div className="py-6 space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0 }}
                >
                  <button
                    onClick={() => handleNavClick("#products")}
                    className="block w-full text-left py-3 text-foreground/80 hover:text-foreground font-medium transition-colors"
                  >
                    {t("header.product")}
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    to="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-3 text-foreground/80 hover:text-foreground font-medium transition-colors"
                  >
                    {t("header.about")}
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <button
                    onClick={() => setIsMobileSupportOpen((prev) => !prev)}
                    className="block w-full text-left py-3 text-foreground/80 hover:text-foreground font-medium transition-colors"
                  >
                    {t("header.support")}
                  </button>
                  <AnimatePresence>
                    {isMobileSupportOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden pl-4 border-l border-border/40"
                      >
                        {supportLinks.map((item) => (
                          <Link
                            key={item.label}
                            to={item.href}
                            onClick={() => { setIsMenuOpen(false); setIsMobileSupportOpen(false); }}
                            className="block py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4"
                >
                  <Button
                    variant="hero"
                    className="w-full shadow-elegant"
                    onClick={() => handleNavClick("#products")}
                  >
                    {t("header.buy")}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
