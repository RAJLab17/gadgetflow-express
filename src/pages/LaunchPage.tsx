import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Mail, Loader2, Check, Smartphone, Headphones, Watch } from "lucide-react";

// Below-the-fold sections — lazy-loaded to reduce initial JS
const LaunchFAQSection = lazy(() => import("@/components/launch/LaunchFAQSection"));
const LaunchSecondCTA = lazy(() => import("@/components/launch/LaunchSecondCTA"));
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
// canvas-confetti is loaded lazily on first signup to keep the initial bundle small
import LikeBadge from "@/components/LikeBadge";
import HeroCarousel from "@/components/HeroCarousel";
import HeroBadgesAndCTA from "@/components/HeroBadgesAndCTA";
import SwissFlag from "@/components/SwissFlag";
import lifestyleLaptop from "@/assets/lifestyle-laptop.webp";
import lifestyleWoman from "@/assets/lifestyle-woman.webp";

import { useLanguage } from "@/contexts/LanguageContext";
import { trackMetaEvent } from "@/lib/meta-pixel";


import logo from "@/assets/logo-new.webp";
import chargerHero from "@/assets/products/charger-3in1-inuse.webp";
import chargerColors from "@/assets/products/charger-3in1-colors-new.webp";
import chargerAngles from "@/assets/products/charger-3in1-angles.webp";
import chargerFastCharge from "@/assets/products/charger-3in1-fast-charge.webp";


const nexusImages = [chargerFastCharge, chargerColors, chargerAngles];

const LAUNCH_DATE = new Date("2026-05-06T20:00:00+02:00").getTime();

const CountdownTimer = () => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, LAUNCH_DATE - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { value: timeLeft.days, label: t("countdown.days") },
    { value: timeLeft.hours, label: t("countdown.hours") },
    { value: timeLeft.minutes, label: t("countdown.minutes") },
    { value: timeLeft.seconds, label: t("countdown.seconds") },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35 }}
      className="flex justify-center gap-3 mb-3 md:mb-6"
    >
      {units.map((u) => (
        <div key={u.label} className="flex flex-col items-center">
          <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2c2c2c] tabular-nums leading-none tracking-tight">
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#9b6b3f] font-semibold mt-1">
            {u.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
};

const fireConfetti = async () => {
  const { default: confetti } = await import("canvas-confetti");
  const colors = ["#9b6b3f", "#f0ede6"];
  const end = Date.now() + 3000;
  const frame = () => {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors });
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
};

const SignupToast = () => {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 100);
    const fadeTimer = setTimeout(() => setFading(true), 5000);
    const hideTimer = setTimeout(() => setVisible(false), 5500);
    return () => { clearTimeout(showTimer); clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 transition-all duration-500 flex items-center gap-2 ${fading ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"}`}
      style={{
        background: "#f0ede6",
        borderLeft: "3px solid #9b6b3f",
        borderRadius: "8px",
        padding: "12px 16px",
        fontSize: "14px",
        color: "#3d2b1a",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        maxWidth: "320px",
      }}
    >
      <SwissFlag size={16} />
      <span>{t("toast.signup")}</span>
    </div>
  );
};

const CountUpNumber = ({ target }: { target: number }) => {
  const [current, setCurrent] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), 100);
    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!started || target <= 0) return;
    const duration = 1500;
    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target]);

  return <span className="font-bold text-[#9b6b3f]">{current}</span>;
};

const TOTAL_SPOTS = 100;
const DEFAULT_TAKEN = 9;

const LaunchPage = () => {
  const { t, lang, setLang } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  // Honeypot fields (must stay empty — bots will fill them)
  const [hpWebsite, setHpWebsite] = useState("");
  const [hpCompany, setHpCompany] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [autoPlayKey, setAutoPlayKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [spotsTaken, setSpotsTaken] = useState(DEFAULT_TAKEN);
  const [showSignupToast, setShowSignupToast] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);

  // Track ViewContent on mount
  useEffect(() => {
    trackMetaEvent("ViewContent", {
      customData: { content_name: "RAJ NEXUS Launch Page", content_category: "Landing Page" },
    });
  }, []);

  // Visitor tracking + fetch visitor count
  useEffect(() => {
    const handleVisitor = async () => {
      try {
        const storageKey = "raj_visitor_id";
        let visitorId: string;
        if (!localStorage.getItem(storageKey)) {
          visitorId = crypto.randomUUID();
          localStorage.setItem(storageKey, visitorId);
        } else {
          visitorId = localStorage.getItem(storageKey)!;
        }
        const count = await supabase.rpc("register_unique_visitor", { p_visitor_id: visitorId });
        if (count.data !== null) {
          setVisitorCount(count.data);
        }
      } catch (e) {
        console.error("Failed to handle visitor count:", e);
      }
    };
    handleVisitor();
  }, []);

  // Spots-Counter ist fix auf 29 verfügbar (DEFAULT_TAKEN = 71). Live-Signups werden bewusst nicht addiert, um die Anzeige stabil zu halten.
  // Auto-rotate carousel
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentImage((prev) => (prev + 1) % nexusImages.length);
    }, 4000);
    return () => clearTimeout(timer);
  }, [currentImage, autoPlayKey]);

  const handleImageNav = useCallback((index: number) => {
    setCurrentImage(index);
    setAutoPlayKey((prev) => prev + 1);
  }, []);

  const handleSwipe = useCallback((_: any, info: { offset: { x: number } }) => {
    if (info.offset.x < -50) handleImageNav((currentImage + 1) % nexusImages.length);
    else if (info.offset.x > 50) handleImageNav((currentImage - 1 + nexusImages.length) % nexusImages.length);
  }, [currentImage, handleImageNav]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error(t("error.invalidEmail"));
      return;
    }
    // Honeypot: bot detected — fake success, don't submit
    if (hpWebsite || hpCompany) {
      setIsSubmitted(true);
      return;
    }
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("brevo-subscribe", {
        body: { email: email.trim() },
      });
      if (error) throw error;
      if (data?.success) {
        setIsSubmitted(true);
        setSpotsTaken((prev) => Math.min(TOTAL_SPOTS, prev + 1));
        fireConfetti();
        setTimeout(() => setShowSignupToast(true), 3000);
        trackMetaEvent("Lead", { email: email.trim() });
      } else {
        throw new Error(data?.error || "Unbekannter Fehler");
      }
    } catch (error) {
      console.error("Launch signup failed:", error);
      toast.error(t("error.failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSecondSignupSuccess = useCallback(() => {
    setSpotsTaken((prev) => Math.min(TOTAL_SPOTS, prev + 1));
    fireConfetti();
    setTimeout(() => setShowSignupToast(true), 3000);
  }, []);

  return (
    <>
      <Helmet>
        <title>RAJ NEXUS — 3-in-1 Qi2 Wireless Charger | Swiss Brand</title>
        <meta
          name="description"
          content="iPhone, AirPods & Apple Watch gleichzeitig laden. Qi2.2 zertifiziert, 25W. CHF 99 Early Access. Gratis Lieferung Schweiz."
        />
        <meta property="og:title" content="RAJ NEXUS — 3-in-1 Qi2 Wireless Charger" />
        <meta property="og:description" content="iPhone, AirPods & Apple Watch gleichzeitig laden. CHF 99 Early Access. Swiss Brand." />
        <meta property="og:site_name" content="RAJ" />
        <meta property="og:type" content="product" />
        <meta property="og:url" content="https://raj.ch" />
      </Helmet>

      <div className="min-h-screen bg-[#f0ede6] relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f0ede6] via-[#f0ede6] to-[#f0ede6]" />
        {prefersReducedMotion ? (
          <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#9b6b3f]/8 rounded-full blur-[180px] opacity-30" />
        ) : (
          <motion.div
            className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#9b6b3f]/8 rounded-full blur-[180px]"
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: "transform, opacity" }}
          />
        )}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(#2c2c2c 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10">
          {/* Mini Header with Language Toggle */}
          <div className="py-1 md:py-4 px-4 flex items-center justify-between">
            <img src={logo} alt="RAJ" width={120} height={40} className="h-10 w-auto" />
            <div className="flex items-center gap-1 text-xs font-medium">
              <button
                onClick={() => setLang("de")}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  lang === "de" ? "text-[#2c2c2c] font-bold" : "text-[#2c2c2c]/50 hover:text-[#2c2c2c]"
                }`}
              >
                DE
              </button>
              <span className="text-[#2c2c2c]/30">|</span>
              <button
                onClick={() => setLang("fr")}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  lang === "fr" ? "text-[#2c2c2c] font-bold" : "text-[#2c2c2c]/50 hover:text-[#2c2c2c]"
                }`}
              >
                FR
              </button>
              <span className="text-[#2c2c2c]/30">|</span>
              <button
                onClick={() => setLang("it")}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  lang === "it" ? "text-[#2c2c2c] font-bold" : "text-[#2c2c2c]/50 hover:text-[#2c2c2c]"
                }`}
              >
                IT
              </button>
            </div>
          </div>

          {/* ===== 1. FOUNDER CTA (HERO) + CAROUSEL BELOW ===== */}
          <HeroBadgesAndCTA
            spotsTaken={spotsTaken}
            onSignupSuccess={() => {
              setSpotsTaken((prev) => Math.min(TOTAL_SPOTS, prev + 1));
              fireConfetti();
              setTimeout(() => setShowSignupToast(true), 3000);
            }}
          />
          <HeroCarousel />

          {/* Lifestyle duo */}
          <section className="container mx-auto px-4 pt-6 md:pt-10">
            <div className="grid grid-cols-2 gap-3 md:gap-5 max-w-5xl mx-auto">
              {[lifestyleLaptop, lifestyleWoman].map((src, i) => (
                <motion.img
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  src={src}
                  alt="RAJ NEXUS Lifestyle"
                  loading="lazy"
                  className="w-full h-full rounded-xl object-cover aspect-square"
                />
              ))}
            </div>
          </section>


          <section className="container mx-auto px-4 pt-2 pb-4 md:pt-4 md:pb-12">
            <div className="max-w-2xl mx-auto text-center w-full">

              {/* Tagline directly after benefits */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.85 }}
                className="text-lg md:text-xl font-light text-muted-foreground tracking-wide text-center"
                style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif" }}
              >
                {t("tagline.1")}
              </motion.p>


              {/* 8. Conviction text (after form) */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-sm sm:text-base md:text-lg font-bold text-foreground max-w-lg mx-auto text-center"
                style={{ marginTop: '56px' }}
              >
                {t("launch.conviction2.bold")}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="text-sm sm:text-base md:text-lg italic text-[#888888] max-w-lg mx-auto leading-relaxed"
                style={{ marginTop: '20px', marginBottom: '16px' }}
              >
                {t("launch.conviction2.sub")}
              </motion.p>

              {/* Device icons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="flex items-center justify-center gap-6"
                style={{ marginTop: '24px' }}
              >
                <div className="flex flex-col items-center gap-1.5">
                  <Smartphone className="w-5 h-5 text-[#9b6b3f]" strokeWidth={1.5} />
                  <span className="text-[10px] text-[#888888] font-medium">iPhone</span>
                </div>
                <span className="text-[#9b6b3f]/30 text-lg">·</span>
                <div className="flex flex-col items-center gap-1.5">
                  <Headphones className="w-5 h-5 text-[#9b6b3f]" strokeWidth={1.5} />
                  <span className="text-[10px] text-[#888888] font-medium">AirPods</span>
                </div>
                <span className="text-[#9b6b3f]/30 text-lg">·</span>
                <div className="flex flex-col items-center gap-1.5">
                  <Watch className="w-5 h-5 text-[#9b6b3f]" strokeWidth={1.5} />
                  <span className="text-[10px] text-[#888888] font-medium">Apple Watch</span>
                </div>
              </motion.div>
            </div>
          </section>


          {/* ===== WARUM RAJ? ===== */}
          <section className="container mx-auto px-4 pt-8 pb-10 md:pt-6 md:pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-xl mx-auto text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#2c2c2c] mb-6" style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif" }}>
                {t("why.title")} <span className="text-[#9b6b3f]">RAJ</span>?
              </h2>

              <p className="text-[#555] leading-relaxed text-base md:text-lg">
                {t("why.text")}
              </p>
            </motion.div>
          </section>

          {/* FAQ + Second CTA — lazy-loaded (below-the-fold) */}
          <Suspense fallback={<div className="py-16" />}>
            <LaunchFAQSection />
            <LaunchSecondCTA onSignupSuccess={handleSecondSignupSuccess} />
          </Suspense>


          <footer className="border-t border-[#9b6b3f]/10 py-8 bg-[#f0ede6]">
            <div className="container mx-auto px-4 flex flex-col items-center gap-4 text-center">
              <img src={logo} alt="RAJ" width={96} height={32} className="h-8 w-auto opacity-60" />
              <p className="text-xs text-[#888888] uppercase tracking-[0.2em]">
                Power. Always There.
              </p>
              <div className="flex items-center gap-5">
                <a href="https://www.instagram.com/raj_swiss_" target="_blank" rel="noopener noreferrer" className="text-[#888888] hover:text-[#9b6b3f] transition-colors" aria-label="Instagram">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </a>
                <a href="https://www.tiktok.com/@raj.swiss" target="_blank" rel="noopener noreferrer" className="text-[#888888] hover:text-[#9b6b3f] transition-colors" aria-label="TikTok">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.3z" /></svg>
                </a>
                <a href="https://www.facebook.com/rajswiss.ch/" target="_blank" rel="noopener noreferrer" className="text-[#888888] hover:text-[#9b6b3f] transition-colors" aria-label="Facebook">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
              </div>
              <div className="flex items-center gap-4">
                <a href="/impressum" className="text-xs text-[#888888] hover:text-[#2c2c2c] transition-colors">Impressum</a>
                <a href="/datenschutz" className="text-xs text-[#888888] hover:text-[#2c2c2c] transition-colors">Datenschutz</a>
                <a href="/agb" className="text-xs text-[#888888] hover:text-[#2c2c2c] transition-colors">AGB</a>
              </div>
              <p className="text-xs text-[#888888]">
                © {new Date().getFullYear()} RAJ · {t("footer.rights")}
              </p>
            </div>
          </footer>
        </div>
      </div>
      {showSignupToast && <SignupToast />}

      {/* Sticky mobile CTA removed per user request */}
    </>
  );
};

export default LaunchPage;
