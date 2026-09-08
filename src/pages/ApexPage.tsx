import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Car, Wind, Mail, Loader2, Check, ArrowRight, RotateCcw, Truck } from "lucide-react";
import { trackMetaEvent } from "@/lib/meta-pixel";
import { useViewContent } from "@/hooks/useViewContent";
import Header from "@/components/Header";
import NexusTrustBar from "@/components/nexus/NexusTrustBar";
import Qi2CertifiedBadge from "@/components/nexus/Qi2CertifiedBadge";
import { breadcrumbJsonLd } from "@/lib/schemas";
import logoTransparent from "@/assets/logo-transparent.webp";

import apexDash480 from "@/assets/products/apex-dash-480.webp";
import apexDash900 from "@/assets/products/apex-dash-900.webp";
import apexDash1400 from "@/assets/products/apex-dash-1400.webp";
import apexVent480 from "@/assets/products/apex-vent-480.webp";
import apexVent900 from "@/assets/products/apex-vent-900.webp";
import apexVent1400 from "@/assets/products/apex-vent-1400.webp";

const getSupabase = () => import("@/integrations/supabase/client").then((m) => m.supabase);

const IS_LIVE = false;
const WARRANTY = "3 Jahre Garantie";

type ApexVariantId = "dash" | "vent";

interface ApexVariant {
  id: ApexVariantId;
  name: string;
  tagline: string;
  mount: string;
  icon: React.ReactNode;
  img480: string;
  img900: string;
  img1400: string;
  sku: string;
  price: number;
  compareAt: number;
}

const APEX_VARIANTS: ApexVariant[] = [
  {
    id: "dash",
    name: "APEX Silver",
    tagline: "Silber — dezent & elegant",
    mount: "Saugmontage, Lüftungsclip, USB-C Kabel & Kfz-Ladeadapter im Lieferumfang",
    icon: <Car className="w-4 h-4" />,
    img480: apexDash480,
    img900: apexDash900,
    img1400: apexDash1400,
    sku: "RAJ-APX-Q2-SLV",
    price: 75,
    compareAt: 99,
  },
  {
    id: "vent",
    name: "APEX Black",
    tagline: "Space Black — sportlich & matt",
    mount: "Saugmontage, Lüftungsclip, USB-C Kabel & Kfz-Ladeadapter im Lieferumfang",
    icon: <Wind className="w-4 h-4" />,
    img480: apexVent480,
    img900: apexVent900,
    img1400: apexVent1400,
    sku: "RAJ-APX-Q2-BLK",
    price: 69,
    compareAt: 99,
  }
];

const H = {
  gold: "#9b6b3f",
  goldLight: "#C9A876",
  border: "#E8E2D6",
  text: "#1A1A1A",
  textMuted: "#6B6358",
};

const APEX_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "RAJ APEX — MagSafe Auto-Ladehalterung",
  description:
    "RAJ APEX ist eine Qi2 MagSafe-kompatible Auto-Ladehalterung mit bis zu 25W. Jede APEX kommt mit Saugmontage (Armaturenbrett/Scheibe), Lüftungsclip mit Schnellverschluss, USB-C Kabel und Kfz-Ladeadapter — inkl. aktiver Kühlung. Erhältlich in Silber oder Space Black.",
  brand: { "@type": "Brand", name: "RAJ" },
  image: `https://raj.ch${apexDash1400.url}`,
  offers: APEX_VARIANTS.map((v) => ({
    "@type": "Offer",
    sku: v.sku,
    name: v.name,
    priceCurrency: "CHF",
    price: v.price,
    availability: IS_LIVE ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
    url: "https://raj.ch/apex",
  })),
};

const FAQ_APEX_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Was ist der Unterschied zwischen APEX Silver und APEX Black?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Funktional sind beide Varianten identisch: Jede APEX kommt mit Saugmontage für Armaturenbrett und Windschutzscheibe, Lüftungsclip mit Schnellverschluss, USB-C Kabel und Kfz-Ladeadapter. Beide laden dein iPhone kabellos mit bis zu 25W (Qi2), sind 360° drehbar und verfügen über aktive Kühlung. Der einzige Unterschied ist die Farbe: Silber oder Space Black.",
      },
    },
    {
      "@type": "Question",
      name: "Wann kann ich RAJ APEX kaufen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "RAJ APEX startet in Kürze. Trage dich mit deiner E-Mail-Adresse ein, um als Erster informiert zu werden und dir den Early-Access-Preis zu sichern.",
      },
    },
    {
      "@type": "Question",
      name: "Ist RAJ APEX mit meinem iPhone kompatibel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja. RAJ APEX ist mit iPhone 12–18 (inkl. Pro und Pro Max) sowie allen offiziellen MagSafe-Hüllen kompatibel.",
      },
    },
    {
      "@type": "Question",
      name: "Ist ein Ladekabel im Lieferumfang enthalten?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, RAJ APEX wird inklusive USB-C Kabel, Kfz-Ladeadapter, Saugmontage und Lüftungsclip mit Schnellverschluss geliefert.",
      },
    },
    {
      "@type": "Question",
      name: "Gibt es Garantie auf RAJ APEX?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `RAJ APEX kommt mit ${WARRANTY} ab Kaufdatum.`,
      },
    },
  ],
};

const WaitlistForm = ({ variant }: { variant: ApexVariant }) => {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    if (hp) { setDone(true); return; }
    setBusy(true);
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase.functions.invoke("brevo-subscribe", {
        body: { email: email.trim(), product: "apex", variant: variant.id },
      });
      if (error) throw error;
      if (data?.success) {
        setDone(true);
        trackMetaEvent("Lead", { email: email.trim(), customData: { content_name: variant.name } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border p-4" style={{ borderColor: H.border, background: "#FAF9F7" }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: H.gold, color: "white" }}>
          <Check className="w-5 h-5" />
        </div>
        <div className="text-sm" style={{ color: H.text }}>
          Du bist auf der Liste für <strong>{variant.name}</strong>.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <input type="text" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px" }} aria-hidden />
      <div className="flex w-full min-w-0 items-center gap-2 rounded-2xl border p-1 pl-3" style={{ borderColor: H.border, background: "#FFFFFF" }}>
        <Mail className="w-4 h-4 shrink-0" style={{ color: H.textMuted }} />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="deine@email.ch"
          className="flex-1 min-w-0 w-full bg-transparent outline-none px-1 py-3 text-sm"
          style={{ color: H.text }}
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl px-3 sm:px-4 py-2.5 text-sm font-semibold transition-transform active:scale-95"
          style={{ background: H.gold, color: "white" }}
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : (<>Vormerken <ArrowRight className="w-4 h-4" /></>)}
        </button>
      </div>
      <p className="text-xs" style={{ color: H.textMuted }}>Unverbindlich · Jederzeit abmeldbar</p>
    </form>
  );
};

const ApexPage = () => {
  const [selected, setSelected] = useState<ApexVariantId>("dash");
  const variant = APEX_VARIANTS.find((v) => v.id === selected)!;

  useViewContent({
    content_name: variant.name,
    content_ids: [variant.sku],
    content_type: "product",
    content_category: "Auto MagSafe Charger",
    value: variant.price,
    currency: "CHF",
  });

  const breadcrumb = breadcrumbJsonLd([
    { name: "RAJ", url: "https://raj.ch/" },
    { name: "APEX Auto-Ladehalterung", url: "https://raj.ch/apex" },
  ]);

  return (
    <>
      <Helmet>
        <title>RAJ APEX — MagSafe Auto-Ladehalterung mit Qi2 · 25W | RAJ</title>
        <meta name="description" content="RAJ APEX: MagSafe Auto-Ladehalterung mit bis zu 25W. Wähle zwischen Dashboard-Montage (APEX Dash) oder Lüftungsdüse (APEX Vent). Swiss Brand." />
        <link rel="canonical" href="https://raj.ch/apex" />
        <meta property="og:title" content="RAJ APEX — MagSafe Auto-Ladehalterung" />
        <meta property="og:description" content="Dein iPhone. Sicher am Ort. Egal welches Auto." />
        <meta property="og:type" content="product" />
        <meta property="og:url" content="https://raj.ch/apex" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(APEX_JSON_LD)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_APEX_JSON_LD)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <Header topSlot={<NexusTrustBar />} />

      <main style={{ background: "#FFFFFF", color: H.text }}>
        {/* HERO */}
        <section className="pt-[120px] md:pt-[152px] pb-12 md:pb-20">
          <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
              {/* LEFT — image (sticky on desktop) */}
              <div className="relative order-1 lg:col-span-6 min-w-0 mx-auto w-full max-w-[340px] sm:max-w-[420px] lg:max-w-none lg:sticky lg:top-24">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={variant.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="relative rounded-2xl md:rounded-[28px] overflow-hidden"
                    style={{
                      background: "linear-gradient(180deg, #FAF9F7 0%, #FFFFFF 100%)",
                      border: `1px solid ${H.border}`,
                      aspectRatio: "1 / 1",
                    }}
                  >
                    <img
                      src={variant.img900}
                      srcSet={`${variant.img480} 480w, ${variant.img900} 900w, ${variant.img1400} 1400w`}
                      sizes="(max-width: 1024px) 90vw, 46vw"
                      alt={`${variant.name} — MagSafe Auto-Ladehalterung`}
                      width={900}
                      height={900}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="w-full h-full object-contain p-5 md:p-10"
                    />
                    <div className="absolute bottom-3 left-3 md:bottom-5 md:left-5">
                      <Qi2CertifiedBadge size={32} variant="dark" />
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Variant thumbs — desktop */}
                <div className="hidden lg:flex gap-3 mt-4">
                  {APEX_VARIANTS.map((v) => {
                    const active = v.id === selected;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelected(v.id)}
                        aria-label={v.name}
                        className="w-20 h-20 rounded-2xl overflow-hidden transition-all"
                        style={{
                          border: active ? `1.5px solid ${H.gold}` : `1px solid ${H.border}`,
                          background: "#FAF9F7",
                          opacity: active ? 1 : 0.65,
                        }}
                      >
                        <img src={v.img480} alt="" className="w-full h-full object-contain p-1.5" loading="lazy" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT — content */}
              <div className="order-2 lg:col-span-6 min-w-0">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] mb-5" style={{ color: H.gold }}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70" style={{ background: H.goldLight }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: H.gold }} />
                  </span>
                  Bald verfügbar — Early Access
                </div>

                <h1 className="font-bold leading-[0.95] mb-3" style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", letterSpacing: "-0.02em" }}>
                  RAJ <span style={{ background: `linear-gradient(90deg, ${H.gold}, ${H.goldLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>APEX</span>
                </h1>

                <p className="text-lg md:text-xl mb-7" style={{ color: H.textMuted }}>
                  Dein iPhone. Sicher am Ort.<br />Egal welches Auto.
                </p>

                {/* Variant selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {APEX_VARIANTS.map((v) => {
                    const active = v.id === selected;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelected(v.id)}
                        className="text-left transition-all min-w-0"
                        style={{
                          padding: "14px 16px",
                          borderRadius: 14,
                          border: active ? `1.5px solid ${H.gold}` : `1px solid ${H.border}`,
                          background: active ? "rgba(155,107,63,.06)" : "#FFFFFF",
                          boxShadow: active ? "0 6px 20px rgba(155,107,63,.12)" : "0 1px 6px rgba(26,26,26,.03)",
                        }}
                      >
                        <div className="flex items-center gap-2 font-semibold text-sm" style={{ color: H.text }}>
                          {v.icon} {v.name}
                        </div>
                        <div className="text-xs mt-1 leading-snug" style={{ color: H.textMuted }}>{v.tagline}</div>
                        <div className="text-xs mt-2 font-semibold" style={{ color: H.gold }}>CHF {v.price}.–</div>
                      </button>
                    );
                  })}
                </div>

                {/* Feature chips */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {["Qi2 · 25 W", "Aktive Kühlung", "Saug + Lüftungsclip", WARRANTY].map((b) => (
                    <span key={b} className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: "#FAF9F7", border: `1px solid ${H.border}`, color: H.text }}>
                      ✓ {b}
                    </span>
                  ))}
                </div>

                <p className="text-sm leading-relaxed mb-7" style={{ color: H.textMuted }}>
                  Jede APEX kommt komplett im Lieferumfang: <strong>Saugmontage</strong> (Armaturenbrett & Scheibe, 360° drehbar), <strong>Lüftungsclip mit Schnellverschluss</strong>, <strong>USB-C Kabel</strong> und <strong>Kfz-Ladeadapter</strong>. MagSafe-Halt, aktive Kühlung und bis zu 25W kabelloses Laden — für jedes Auto, jede Situation.
                </p>

                {/* Preis + Warteliste */}
                <div className="rounded-2xl border p-5" style={{ borderColor: H.border, background: "#FAF9F7" }}>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4">
                    <span className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: H.text }}>
                      Early Access CHF {variant.price}.–
                    </span>
                    <span className="text-sm line-through" style={{ color: H.textMuted }}>
                      CHF {variant.compareAt}.–
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={variant.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <WaitlistForm variant={variant} />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-x-5 gap-y-3 mt-6 text-xs" style={{ color: H.textMuted }}>
                  {[
                    { i: <RotateCcw className="w-3.5 h-3.5" />, t: "30 Tage Rückgabe" },
                    { i: <img src={logoTransparent} alt="" className="w-4 h-4 object-contain" />, t: "Swiss Brand" },
                    { i: <Truck className="w-3.5 h-3.5" />, t: "Lieferung in 2–3 Werktagen" },
                  ].map((b, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5">
                      {b.i} {b.t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SPECS / ÜBERSICHT */}
        <section className="py-14 md:py-20 border-t" style={{ borderColor: H.border }}>
          <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: H.text }}>Auf einen Blick</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { t: "Qi2 · bis 25 W", d: "Kabelloses Schnellladen mit magnetischer MagSafe-Ausrichtung." },
                { t: "Zwei Montagen", d: "Saugmontage für Armaturenbrett & Scheibe plus Lüftungsclip." },
                { t: "Aktive Kühlung", d: "Leiser Lüfter hält die Ladeleistung auch im Sommer stabil." },
                { t: "iPhone 12–18", d: "Kompatibel inkl. Pro & Pro Max und offiziellen MagSafe-Hüllen." },
              ].map((s) => (
                <div key={s.t} className="rounded-2xl border p-5 h-full" style={{ borderColor: H.border, background: "#FAF9F7" }}>
                  <div className="font-semibold mb-1.5" style={{ color: H.text }}>{s.t}</div>
                  <p className="text-sm leading-relaxed" style={{ color: H.textMuted }}>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* FAQ */}
        <section className="py-16 border-t" style={{ borderColor: H.border, background: "#FAF9F7" }}>
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: H.text }}>
              Häufige Fragen
            </h2>
            <div className="space-y-3">
              {FAQ_APEX_JSON_LD.mainEntity.map((q, i) => (
                <details key={i} className="group rounded-2xl border p-5 bg-white" style={{ borderColor: H.border }}>
                  <summary className="cursor-pointer font-semibold list-none flex items-center justify-between" style={{ color: H.text }}>
                    {q.name}
                    <span className="ml-4 transition-transform group-open:rotate-45 text-2xl leading-none" style={{ color: H.gold }}>+</span>
                  </summary>
                  <p className="mt-3 text-sm" style={{ color: H.textMuted }}>{q.acceptedAnswer.text}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ApexPage;
