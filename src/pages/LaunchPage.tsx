import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, Check, Zap, Shield, Truck, Sparkles, Heart, Target, Eye, Award, Users, ChevronLeft, ChevronRight, Eye as EyeIcon } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LikeBadge from "@/components/LikeBadge";

import logo from "@/assets/logo-new.png";
import chargerHero from "@/assets/products/charger-3in1-inuse.png";
import chargerColors from "@/assets/products/charger-3in1-colors-new.png";
import chargerAngles from "@/assets/products/charger-3in1-angles.png";
import chargerSpecs from "@/assets/products/charger-3in1-specs-hero.png";

const nexusImages = [chargerHero, chargerSpecs, chargerColors, chargerAngles];

const LAUNCH_DATE = new Date("2026-05-06T00:00:00+02:00").getTime();

const CountdownTimer = () => {
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
    { value: timeLeft.days, label: "Tage" },
    { value: timeLeft.hours, label: "Std" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sek" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35 }}
      className="flex justify-center gap-3 mb-6"
    >
      {units.map((u) => (
        <div key={u.label} className="flex flex-col items-center">
          <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2c2c2c] tabular-nums leading-none">
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

const TOTAL_SPOTS = 100;
const DEFAULT_TAKEN = 0;

const LaunchPage = () => {
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [autoPlayKey, setAutoPlayKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting2, setIsSubmitting2] = useState(false);
  const [isSubmitted2, setIsSubmitted2] = useState(false);
  const [spotsTaken, setSpotsTaken] = useState(DEFAULT_TAKEN);
  const [visitorCount, setVisitorCount] = useState(659);

  // Increment only for new visitors (localStorage flag), otherwise just fetch
  useEffect(() => {
    const handleVisitor = async () => {
      try {
        const hasVisited = localStorage.getItem("raj_visitor_counted");
        if (!hasVisited) {
          const { data, error } = await supabase.rpc("increment_visitor_count");
          if (!error && data) {
            setVisitorCount(data);
            localStorage.setItem("raj_visitor_counted", "1");
          }
        } else {
          const { data, error } = await supabase
            .from("visitor_counter")
            .select("count")
            .eq("id", 1)
            .single();
          if (!error && data) {
            setVisitorCount(data.count);
          }
        }
      } catch (e) {
        console.error("Failed to handle visitor count:", e);
      }
    };
    handleVisitor();
  }, []);

  // Fetch signup count from database
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { count, error } = await supabase
          .from("launch_signups")
          .select("*", { count: "exact", head: true });
        if (!error && count !== null) {
          setSpotsTaken(DEFAULT_TAKEN + count);
        }
      } catch (e) {
        console.error("Failed to fetch signup count:", e);
      }
    };
    fetchCount();
  }, []);

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
      toast.error("Bitte gib eine gültige E-Mail-Adresse ein.");
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
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Lead');
        }
      } else {
        throw new Error(data?.error || "Unbekannter Fehler");
      }
    } catch (error) {
      console.error("Launch signup failed:", error);
      toast.error("Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email2 || !email2.includes("@")) {
      toast.error("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }
    setIsSubmitting2(true);
    try {
      const { data, error } = await supabase.functions.invoke("brevo-subscribe", {
        body: { email: email2.trim() },
      });
      if (error) throw error;
      if (data?.success) {
        setIsSubmitted2(true);
        setSpotsTaken((prev) => Math.min(TOTAL_SPOTS, prev + 1));
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Lead');
        }
      } else {
        throw new Error(data?.error || "Unbekannter Fehler");
      }
    } catch (error) {
      console.error("Launch signup failed:", error);
      toast.error("Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setIsSubmitting2(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>RAJ – Coming Soon | Premium Ladezubehör aus der Schweiz</title>
        <meta
          name="description"
          content="RAJ lanciert bald: Premium Ladezubehör mit Schweizer Design. Trag dich ein und erfahre als Erstes, wann wir live gehen."
        />
      </Helmet>

      <div className="min-h-screen bg-[#f0ede6] relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f0ede6] via-[#f0ede6] to-[#f0ede6]" />
        <motion.div
          className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#9b6b3f]/8 rounded-full blur-[180px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(#2c2c2c 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10">
          {/* Header spacer */}
          <div className="py-4" />

          {/* ===== 1. HERO SECTION ===== */}
          <section className="container mx-auto px-4 pt-8 pb-6 md:pt-16 md:pb-10">
            <div className="max-w-3xl mx-auto text-center">
              {/* Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-center gap-2 mb-6"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-[#9b6b3f]/15 text-xs font-medium text-[#2c2c2c]">
                  🇨🇭 Swiss Brand
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-[#9b6b3f]/15 text-xs font-medium text-[#2c2c2c]">
                  Launch: 6. Mai 2026
                </span>
              </motion.div>

              {/* Scarcity Line */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center justify-center gap-2 mb-6"
              >
                <span className="text-sm font-medium text-[#2c2c2c]">
                  ⚡ Die ersten <span className="font-bold text-[#9b6b3f]">100</span> Besteller erhalten die Founder Edition.
                </span>
              </motion.div>

              {/* Product Name + Image above the fold */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="mb-6"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-[#2c2c2c] mb-4" style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif" }}>
                  RAJ <span className="text-[#9b6b3f]">NEXUS</span>
                </h2>
                <img
                  src={chargerHero}
                  alt="RAJ NEXUS 3-in-1 Wireless Charger mit iPhone, Apple Watch und AirPods"
                  className="w-full max-w-xs sm:max-w-sm mx-auto drop-shadow-xl"
                />
              </motion.div>

              {/* 1. New Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight mb-3"
                style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif" }}
              >
                <span className="text-[#2c2c2c]">Power.</span>{" "}
                <span className="text-[#9b6b3f]">Always There.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg sm:text-xl md:text-2xl font-light text-[#2c2c2c] mb-8"
              >
                3 Geräte. 1 Ladegerät. Kein Kabelsalat mehr.
              </motion.p>

              {/* Price Line */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex items-center justify-center gap-3 mb-8"
              >
                <span className="text-base line-through text-muted-foreground">CHF 129.–</span>
                <span className="text-2xl font-bold text-[#9b6b3f]">CHF 99.–</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#9b6b3f]/10 text-[#9b6b3f]">Early Access</span>
              </motion.div>



              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="max-w-sm mx-auto mb-6 space-y-2"
              >
                {[
                  "Early Access: CHF 99 — danach CHF 129",
                  "Founder Edition mit einzigartiger Seriennummer",
                  "Lebenslanger Vorverkaufs-Zugang (erste 100 Käufer)",
                  "3 Jahre Premium Garantie",
                ].map((text) => (
                  <div key={text} className="flex items-center gap-2.5 text-sm text-[#2c2c2c]">
                    <Check className="w-4 h-4 text-[#9b6b3f] shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </motion.div>

              {/* Email Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="max-w-md mx-auto"
              >
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 bg-white/60 rounded-2xl border border-[#9b6b3f]/20 text-center space-y-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-14 h-14 mx-auto rounded-full bg-[#9b6b3f]/15 flex items-center justify-center"
                    >
                      <Check className="w-7 h-7 text-[#9b6b3f]" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-[#2c2c2c]">
                      Danke für deine Anmeldung
                    </h3>
                    <p className="text-sm text-[#888888]">
                      Du bist auf der Liste und bekommst News direkt per E-Mail.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Progress Bar */}
                    <div className="space-y-1.5 mb-1">
                      <div className="w-full h-1.5 rounded-full bg-[#9b6b3f]/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#9b6b3f] transition-all duration-700"
                          style={{ width: `${Math.min((spotsTaken / TOTAL_SPOTS) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        {spotsTaken} von {TOTAL_SPOTS} Plätzen vergeben
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9b6b3f]/50" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Deine Email-Adresse"
                          required
                          disabled={isSubmitting}
                          className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white border border-gray-200 text-[#2c2c2c] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:border-[#9b6b3f] focus:ring-[#9b6b3f]/20 transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-xl bg-[#9b6b3f] text-white font-bold hover:bg-[#9b6b3f]/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          "MEINEN PLATZ SICHERN"
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-[#888888] text-center">
                      Unverbindlich · Sichere Zahlung · Kostenloser Versand 🇨🇭
                    </p>
                  </form>
                )}
              </motion.div>
            </div>
          </section>

          {/* ===== VIDEO SECTION ===== */}
          <section className="py-8 md:py-12">
            <div className="container mx-auto px-4 flex justify-center">
              <video
                className="w-full max-w-4xl rounded-lg"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/videos/brand-video.mp4" type="video/mp4" />
              </video>
            </div>
          </section>

          {/* ===== 5. Product Teaser – LARGER, no gap ===== */}
          <section className="container mx-auto px-4 pb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center text-2xl md:text-3xl font-bold text-[#2c2c2c] mb-3"
              style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif" }}
            >
              Unser erstes Produkt
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center text-[#888888] mb-12 max-w-lg mx-auto italic"
            >
              Perfekte Eleganz. Qi2 neu definiert.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto"
            >
              <div
                className="group bg-[#f0ede6] rounded-2xl border border-[#9b6b3f]/10 p-6 md:p-8 text-center transition-all duration-300"
                style={{ boxShadow: "0 8px 20px rgba(155, 107, 63, 0.10)" }}
              >
                <div className="relative mb-6 overflow-hidden rounded-xl cursor-grab active:cursor-grabbing">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#9b6b3f]/10 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImage}
                      src={nexusImages[currentImage]}
                      alt="RAJ NEXUS 3-in-1 Wireless Charger"
                      className="w-full aspect-square object-contain relative"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.1}
                      onDragEnd={handleSwipe}
                    />
                  </AnimatePresence>

                </div>

                {/* Dot indicators */}
                <div className="flex justify-center gap-2 mb-4">
                  {nexusImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleImageNav(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === currentImage ? "bg-[#9b6b3f] w-6" : "bg-[#9b6b3f]/25 hover:bg-[#9b6b3f]/50"
                      }`}
                    />
                  ))}
                </div>

                <span className="inline-block text-[10px] uppercase tracking-widest font-semibold text-[#9b6b3f] bg-[#9b6b3f]/10 px-3 py-1 rounded-full mb-3">
                  Coming Soon
                </span>
                <h3 className="text-xl font-bold text-[#2c2c2c] mb-1">
                  RAJ <span className="text-[#9b6b3f]">NEXUS</span>
                </h3>
                <p className="text-sm text-[#888888]">
                  3-in-1 Wireless Charger · Qi2 · 25W
                </p>
              </div>
            </motion.div>
          </section>

          {/* ===== 4. Trust Section – Updated Labels ===== */}
          <section className="container mx-auto px-4 pb-20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { icon: Zap, title: "25W · Qi2 zertifiziert" },
                { icon: Shield, title: "3 Jahre Premium Garantie · CH Support" },
                { icon: Truck, title: "Gratis Lieferung Schweiz" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/60 border border-[#9b6b3f]/10"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#9b6b3f]/10 flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5 text-[#9b6b3f]" />
                  </div>
                  <h3 className="font-semibold text-[#2c2c2c] text-sm">{item.title}</h3>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ===== ÜBER UNS SECTION ===== */}
          <section className="container mx-auto px-4 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="inline-block px-5 py-2 bg-[#9b6b3f]/10 border border-[#9b6b3f]/20 rounded-full text-[#9b6b3f] font-semibold text-xs tracking-widest uppercase mb-6">
                Über RAJ
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#2c2c2c] mb-2" style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif" }}>
                Energie mit <span className="text-[#9b6b3f]">Substanz</span>
              </h2>
            </motion.div>

            {/* Vision & Mission */}
            <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6 mb-10">
              {[
                { label: "Vision", icon: Eye, text: <>
                  <span className="font-medium text-[#2c2c2c]">Power,</span> die einfach da ist, wenn du sie brauchst.
                </> },
                { label: "Mission", icon: Target, text: <>
                  Wir stehen für Energie mit Substanz –{" "}
                  <span className="font-medium text-[#2c2c2c]">klar im Design, ehrlich in der Leistung.</span>
                </> },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white/60 border border-[#9b6b3f]/10"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#9b6b3f]/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#9b6b3f]" />
                    </div>
                    <span className="text-xs font-semibold text-[#9b6b3f] uppercase tracking-widest">{item.label}</span>
                  </div>
                  <p className="text-[#888888] leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Mission Points Grid */}
            <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {[
                { icon: Zap, text: "RAJ steht für Energieprodukte mit klarem Fokus auf Funktion und Beständigkeit." },
                { icon: Sparkles, text: "Jedes Detail ist bewusst gestaltet und auf das Wesentliche reduziert." },
                { icon: Shield, text: "Design, Leistung und Service greifen ineinander und geben Sicherheit." },
                { icon: Heart, text: "So entsteht Energie mit Substanz: verlässlich im Alltag, stark im Moment, dauerhaft im Vertrauen." },
              ].map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group flex items-start gap-3 p-5 rounded-2xl bg-white/60 border border-[#9b6b3f]/10 hover:border-[#9b6b3f]/25 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-[#9b6b3f]/10 rounded-xl flex items-center justify-center group-hover:bg-[#9b6b3f]/15 transition-colors">
                    <point.icon className="w-5 h-5 text-[#9b6b3f]" />
                  </div>
                  <p className="text-sm text-[#888888] group-hover:text-[#2c2c2c] transition-colors leading-relaxed">{point.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Values Grid */}
            <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Target, title: "Fokus", desc: "Reduktion auf das Wesentliche." },
                { icon: Award, title: "Qualität", desc: "Anspruch ohne Kompromisse." },
                { icon: Users, title: "Vertrauen", desc: "Verlässlichkeit im Alltag." },
                { icon: Eye, title: "Transparenz", desc: "Klare Entscheidungen. Klare Preise." },
              ].map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="text-center p-5 rounded-2xl bg-white/60 border border-[#9b6b3f]/10"
                >
                  <div className="w-10 h-10 bg-[#9b6b3f]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <value.icon className="w-5 h-5 text-[#9b6b3f]" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#9b6b3f] mb-1">{value.title}</h3>
                  <p className="text-xs text-[#888888] leading-relaxed">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 md:py-20 bg-[#f5f2ec]">
            <div className="container mx-auto px-4 max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[#2c2c2c] text-center mb-10 tracking-tight">
                Häufige Fragen
              </h2>
              <div className="space-y-0">
                {[
                  { q: "Ist RAJ NEXUS mit meinem Gerät kompatibel?", a: "Ja. Alle iPhones mit MagSafe (iPhone 12 und neuer), Apple Watch, AirPods Pro & AirPods (3. Gen+). Funktioniert auch mit MagSafe Cases." },
                  { q: "Was bringt mir die Early Access Anmeldung?", a: "Du sicherst dir deinen Platz beim Launch im Mai. Die ersten 100 Käufer erhalten: CHF 30 Rabatt + Founder Edition mit Seriennummer + lebenslang 24h früher einkaufen bei allen neuen RAJ Produkten." },
                  { q: "Was passiert nach der Anmeldung?", a: "Du erhältst eine Bestätigung per Email. Keine Zahlung, keine Verpflichtung." },
                  { q: "Was unterscheidet RAJ NEXUS von anderen Chargern?", a: "Qi2.2 Technologie - der neueste Standard (seit Juli 2025), zertifiziert durch das Wireless Power Consortium (WPC). 25W Schnellladen, effizientere Energie, präzisere Ausrichtung. Dazu: Swiss Design, Premium-Materialien, 3 Jahre Garantie." },
                  { q: "Ist das Laden sicher? Was ist mit Überhitzung?", a: "Ja. WPC-zertifiziert mit integrierten Sicherheitsmechanismen: Überhitzungsschutz, Überladeschutz, Fremdkörpererkennung. Qi2.2 ist effizienter und erzeugt weniger Hitze als ältere Standards." },
                  { q: "Ist das der Shop?", a: "Nein, das ist die Pre-Launch Seite. Der offizielle Shop öffnet im Mai 2026." },
                  { q: "Muss ich kaufen?", a: "Nein. Die Anmeldung ist unverbindlich. Im Mai erhältst du das Kaufangebot - du entscheidest dann." },
                  { q: "Warum RAJ?", a: "RAJ ist eine neue Schweizer Brand. Wir bauen Premium Tech-Accessoires mit klarem Design und kompromissloser Qualität." },
                  { q: "Wer bekommt den lebenslangen Vorverkaufs-Zugang?", a: "Nur die ersten 100 Käufer im Mai. Sie können bei allen zukünftigen Produkten 24 Stunden vor dem offiziellen Verkaufsstart einkaufen." },
                  { q: "Wann wird geliefert?", a: "Mai 2026. Early Access Mitglieder haben Priorität bei der Auslieferung." },
                  { q: "Ist der Versand kostenlos?", a: "Ja, kostenloser Versand in der ganzen Schweiz." },
                  { q: "Kann ich zurückgeben?", a: "Ja, 14 Tage Rückgaberecht nach Erhalt." },
                ].map((item, i) => (
                  <details key={i} className="group border-b border-[#9b6b3f]/10">
                    <summary className="flex items-center justify-between py-5 cursor-pointer list-none text-left">
                      <span className="text-[15px] md:text-base font-medium text-[#2c2c2c] pr-6 group-hover:text-[#9b6b3f] transition-colors">
                        {item.q}
                      </span>
                      <svg className="w-4 h-4 shrink-0 text-[#888888] transition-transform duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="pb-5 pr-10">
                      <p className="text-[#666666] text-sm leading-relaxed">{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* ===== 6. Second CTA Section ===== */}
          <section className="bg-[#9b6b3f] py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-lg text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8"
                style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif" }}
              >
                Jetzt Early Access sichern.
              </motion.h2>

              {isSubmitted2 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 bg-white/10 rounded-2xl border border-white/20 text-center space-y-4"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Du bist dabei!
                  </h3>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  onSubmit={handleSubmit2}
                  className="space-y-3"
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="email"
                        value={email2}
                        onChange={(e) => setEmail2(e.target.value)}
                        placeholder="Deine Email-Adresse"
                        required
                        disabled={isSubmitting2}
                        className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-transparent border border-white/40 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:border-white/60 focus:ring-white/20 transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting2}
                      className="px-8 py-3.5 rounded-xl bg-[#f0ede6] text-[#9b6b3f] font-semibold hover:bg-[#f0ede6]/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 min-w-[160px]"
                    >
                      {isSubmitting2 ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                          "MEINEN PLATZ SICHERN"
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </div>
          </section>


          <footer className="border-t border-[#9b6b3f]/10 py-8 bg-[#f0ede6]">
            <div className="container mx-auto px-4 flex flex-col items-center gap-4 text-center">
              <img src={logo} alt="RAJ" className="h-8 w-auto opacity-60" />
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
                © {new Date().getFullYear()} RAJ · Alle Rechte vorbehalten.
              </p>
            </div>
          </footer>
        </div>
      </div>
      
    </>
  );
};

export default LaunchPage;
