import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Check, Minus, ArrowUpRight, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import cherryOrange from "@/assets/matrix/cherry-orange.webp.asset.json";
import cherryBlue from "@/assets/matrix/cherry-blue.webp.asset.json";
import cherrySilver from "@/assets/matrix/cherry-silver.webp.asset.json";
import cherryBlack from "@/assets/matrix/cherry-black.webp.asset.json";
import onyxOrange from "@/assets/matrix/onyx-orange.webp.asset.json";
import onyxBlue from "@/assets/matrix/onyx-blue.webp.asset.json";
import onyxSilver from "@/assets/matrix/onyx-silver.webp.asset.json";
import onyxBlack from "@/assets/matrix/onyx-black.webp.asset.json";
import cherryDarkcherry from "@/assets/matrix/cherry-darkcherry.webp.asset.json";
import cherryDarkgrey from "@/assets/matrix/cherry-darkgrey.webp.asset.json";
import cherrySkyblue from "@/assets/matrix/cherry-skyblue.webp.asset.json";
import onyxDarkcherry from "@/assets/matrix/onyx-darkcherry.webp.asset.json";
import onyxDarkgrey from "@/assets/matrix/onyx-darkgrey.webp.asset.json";
import onyxSkyblue from "@/assets/matrix/onyx-skyblue.webp.asset.json";

/* ── Design tokens (aligned with /produkte editorial system) ─────────── */
const H = {
  bg: "#faf9f7",
  gold: "#9b6b3f",
  line: "rgba(43,39,37,0.10)",
  lineStrong: "rgba(43,39,37,0.22)",
  text: "#2b2725",
  textMuted: "rgba(43,39,37,0.55)",
};

/* ── Data ─────────────────────────────────────────────────────────────── */
type ModelId = "17pro" | "17promax" | "18pro" | "18promax";

interface Model {
  id: ModelId;
  short: string;
  name: string;
  gen: "17" | "18";
  display: string;
  /** echte Gehäusemasse in mm — Basis für die massstabsgetreue Darstellung */
  mm: { w: number; h: number; d: number };
  status: string;
}

const MODELS: Model[] = [
  { id: "17pro", short: "17 Pro", name: "iPhone 17 Pro", gen: "17", display: '6,3"', mm: { w: 71.9, h: 150.0, d: 8.75 }, status: "Verfügbar" },
  { id: "17promax", short: "17 Pro Max", name: "iPhone 17 Pro Max", gen: "17", display: '6,9"', mm: { w: 78.0, h: 163.4, d: 8.75 }, status: "Verfügbar" },
  { id: "18pro", short: "18 Pro", name: "iPhone 18 Pro", gen: "18", display: '6,3"', mm: { w: 71.9, h: 150.0, d: 8.75 }, status: "Vorbestellung" },
  { id: "18promax", short: "18 Pro Max", name: "iPhone 18 Pro Max", gen: "18", display: '6,9"', mm: { w: 78.0, h: 163.4, d: 8.75 }, status: "Vorbestellung" },
];

interface DeviceFinish {
  id: string;
  name: string;
  body: string;
  bodyEdge: string;
  /** Glanzlicht des eloxierten Aluminium-Unibody */
  sheen: string;
  gens: ("17" | "18")[];
}

/** Gerätefarben nach Apple — sichtbar im Kameraplateau und in den Aussparungen. */
const DEVICE_FINISHES: DeviceFinish[] = [
  // iPhone 17 Pro
  { id: "orange", name: "Cosmic Orange", body: "#e3651f", bodyEdge: "#b8460f", sheen: "#f79b55", gens: ["17"] },
  { id: "blue", name: "Deep Blue", body: "#4a5a75", bodyEdge: "#2f3c53", sheen: "#8695ac", gens: ["17"] },
  { id: "silver", name: "Silver", body: "#e4e5e7", bodyEdge: "#b6b8bb", sheen: "#ffffff", gens: ["17", "18"] },
  { id: "black", name: "Space Black", body: "#33333a", bodyEdge: "#141417", sheen: "#6e6e78", gens: ["17"] },
  // iPhone 18 Pro
  { id: "darkcherry", name: "Dark Cherry", body: "#64212c", bodyEdge: "#3d141b", sheen: "#8a2f3a", gens: ["18"] },
  { id: "darkgrey", name: "Dark Grey", body: "#3e4143", bodyEdge: "#27292b", sheen: "#5a5d60", gens: ["18"] },
  { id: "skyblue", name: "Sky Blue", body: "#a7c7e8", bodyEdge: "#7da5cc", sheen: "#c8ddf0", gens: ["18"] },
];

interface CaseFinish {
  id: string;
  name: string;
  material: string;
  /** Grundton des Carbon-Gewebes */
  base: string;
  weave: string;
  edge: string;
  price: number;
}

const CASE_FINISHES: CaseFinish[] = [
  {
    id: "cherry",
    name: "Cherry Carbon",
    material: "Aramid-Carbon, Cherry · Titan-Knöpfe in Gold",
    base: "#6e1420",
    weave: "#a3202f",
    edge: "#420b13",
    price: 79,
  },
  {
    id: "onyx",
    name: "Onyx Carbon",
    material: "Aramid-Carbon, Schwarz · Titan-Knöpfe in Gold",
    base: "#16171a",
    weave: "#33363c",
    edge: "#08090a",
    price: 79,
  },
];


interface Row {
  label: string;
  values: Record<string, string | boolean>;
}

const MATRIX_ROWS: Row[] = [
  { label: "MagSafe Magnetring (N52)", values: { cherry: true, onyx: true } },
  { label: "Qi2.2 · 25 W ohne Verlust", values: { cherry: true, onyx: true } },
  { label: "RAJ NEXUS kompatibel", values: { cherry: true, onyx: true } },
  { label: "RAJ APEX kompatibel", values: { cherry: true, onyx: true } },
  { label: "Knöpfe", values: { cherry: "Titan, goldeloxiert", onyx: "Titan, goldeloxiert" } },
  { label: "Materialstärke", values: { cherry: "0,9 mm", onyx: "0,9 mm" } },
  { label: "Falltest", values: { cherry: "4 m", onyx: "4 m" } },
  { label: "Kameraring Metall", values: { cherry: true, onyx: true } },
  { label: "Gerätefarbe im Plateau sichtbar", values: { cherry: true, onyx: true } },
];

/* ── Visual: Produktrender (Gerät in Hülle) ───────────────────────────── */
const RENDERS: Record<string, { url: string }> = {
  // Gen 17
  "17-cherry-orange": cherryOrange,
  "17-cherry-blue": cherryBlue,
  "17-cherry-silver": cherrySilver,
  "17-cherry-black": cherryBlack,
  "17-onyx-orange": onyxOrange,
  "17-onyx-blue": onyxBlue,
  "17-onyx-silver": onyxSilver,
  "17-onyx-black": onyxBlack,
  // Gen 18
  "18-cherry-darkcherry": cherryDarkcherry,
  "18-cherry-darkgrey": cherryDarkgrey,
  "18-cherry-skyblue": cherrySkyblue,
  "18-cherry-silver": cherrySilver,
  "18-onyx-darkcherry": onyxDarkcherry,
  "18-onyx-darkgrey": onyxDarkgrey,
  "18-onyx-skyblue": onyxSkyblue,
  "18-onyx-silver": onyxSilver,
};

const DeviceMock = ({
  device,
  caseFinish,
  model,
}: {
  device: DeviceFinish;
  caseFinish: CaseFinish;
  model: Model;
}) => {
  /* Pro Max ist real ca. 8,5 % breiter — massstabsgetreue Skalierung */
  const scale = model.mm.w / 71.9;
  const renderKey = `${model.gen}-${caseFinish.id}-${device.id}`;
  const src = RENDERS[renderKey]?.url ?? RENDERS[`${model.gen}-onyx-black`]?.url ?? Object.values(RENDERS)[0].url;
  /* Nur die Render der aktuellen Generation laden */
  const genRenders = Object.entries(RENDERS).filter(([key]) => key.startsWith(`${model.gen}-`));

  return (
    <div
      className="relative mx-auto transition-[width] duration-500 ease-out"
      style={{ width: `min(100%, ${380 * scale}px)`, aspectRatio: "1 / 1" }}
    >
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 bottom-[4%] w-[62%] h-8 rounded-[50%] pointer-events-none"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(43,39,37,0.18), transparent 72%)" }}
      />
      {genRenders.map(([key, asset]) => (
        <img
          key={key}
          src={asset.url}
          alt={
            key === renderKey
              ? `RAJ MATRIX ${caseFinish.name} Hülle für ${model.name} in ${device.name}`
              : ""
          }
          width={1024}
          height={1024}
          loading="lazy"
          decoding="async"
          aria-hidden={asset.url !== src}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
            asset.url === src ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{ mixBlendMode: "multiply" }}
        />
      ))}
      {/* Goldener Blitz — auf dem Case unten links eingeprägt */}
      <Zap
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: "34%",
          bottom: "9%",
          width: 20 * scale,
          height: 20 * scale,
          color: "#c9a227",
          fill: "#e0bc4e",
          filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.35))",
        }}
        strokeWidth={1.2}
      />

    </div>
  );
};



/* ── Page ─────────────────────────────────────────────────────────────── */
const MatrixPage = () => {
  const [modelId, setModelId] = useState<ModelId>("17promax");
  const [deviceId, setDeviceId] = useState("orange");
  const [caseId, setCaseId] = useState("cherry");

  const model = MODELS.find((m) => m.id === modelId)!;
  const finishes = useMemo(
    () => DEVICE_FINISHES.filter((f) => f.gens.includes(model.gen)),
    [model.gen]
  );
  const device = finishes.find((f) => f.id === deviceId) ?? finishes[0];
  const caseFinish = CASE_FINISHES.find((c) => c.id === caseId)!;

  const selectModel = (id: ModelId) => {
    setModelId(id);
    const next = MODELS.find((m) => m.id === id)!;
    if (!DEVICE_FINISHES.find((f) => f.id === deviceId)?.gens.includes(next.gen)) {
      setDeviceId(DEVICE_FINISHES.find((f) => f.gens.includes(next.gen))!.id);
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "RAJ MATRIX Case",
    brand: { "@type": "Brand", name: "RAJ" },
    description:
      "RAJ MATRIX — MagSafe-Cases für iPhone 17 Pro, 17 Pro Max, 18 Pro und 18 Pro Max. Cherry Carbon und Onyx Carbon mit goldenen Titan-Knöpfen, Qi2.2-kompatibel, abgestimmt auf RAJ NEXUS und RAJ APEX.",
    url: "https://raj.ch/matrix",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "CHF",
      lowPrice: 79,
      highPrice: 79,
      offerCount: CASE_FINISHES.length,
      availability: "https://schema.org/PreOrder",
    },
  };

  return (
    <>
      <Helmet>
        <title>RAJ MATRIX — MagSafe Cases für iPhone 17 & 18 Pro | RAJ</title>
        <meta
          name="description"
          content="RAJ MATRIX Cases für iPhone 17 Pro, 17 Pro Max, 18 Pro und 18 Pro Max. Zwei Carbon-Finishes mit goldenen Knöpfen, Qi2.2 mit 25 W, perfekt abgestimmt auf RAJ NEXUS und RAJ APEX."
        />
        <link rel="canonical" href="https://raj.ch/matrix" />
        <meta property="og:title" content="RAJ MATRIX — MagSafe Cases für iPhone 17 & 18 Pro" />
        <meta
          property="og:description"
          content="Zwei Carbon-Finishes, vier Modelle, ein System. Qi2.2 mit 25 W, abgestimmt auf RAJ NEXUS und RAJ APEX."
        />
        <meta property="og:type" content="product" />
        <meta property="og:url" content="https://raj.ch/matrix" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div style={{ background: H.bg, color: H.text }} className="min-h-screen">
        <Header />

        <main className="pt-24 md:pt-28">
          {/* Intro */}
          <section className="container mx-auto px-6 max-w-5xl pt-6 pb-10 md:pb-14">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8" style={{ background: H.gold }} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: H.gold }}>
                03 · Matrix
              </span>
            </div>
            <h1
              className="font-light leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(42px, 6vw, 84px)", letterSpacing: "-0.02em" }}
            >
              MATRIX
            </h1>
            <p className="italic mt-4" style={{ color: H.gold, fontSize: "clamp(18px,1.6vw,22px)" }}>
              Die Hülle als Teil des Systems.
            </p>
            <p className="mt-6 max-w-xl text-base leading-relaxed" style={{ color: H.textMuted }}>
              Vier Modelle, zwei Carbon-Finishes, ein Magnetring. Jede MATRIX-Hülle ist so vermessen, dass NEXUS und APEX
              magnetisch einrasten, als wäre nichts dazwischen. Die Farbe deines iPhones bleibt Teil des Objekts.
            </p>
          </section>

          {/* Konfigurator */}
          <section className="border-t" style={{ borderColor: H.line }}>
            <div className="container mx-auto px-6 max-w-5xl py-12 md:py-20">
              <div className="grid md:grid-cols-12 gap-12 md:gap-14 items-start">
                {/* Bühne */}
                <div className="md:col-span-6 md:sticky md:top-28">
                  <div
                    className="relative overflow-hidden rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(165deg, #ffffff 0%, #fbfaf8 45%, #f2efea 100%)",
                      border: `1px solid ${H.line}`,
                      boxShadow:
                        "0 1px 0 rgba(255,255,255,0.9) inset, 0 24px 60px -30px rgba(43,39,37,0.35)",
                    }}
                  >
                    {/* Goldene Haarlinie oben */}
                    <div
                      aria-hidden
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${H.gold}, transparent)`,
                        opacity: 0.5,
                      }}
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(58% 46% at 50% 42%, rgba(155,107,63,0.13) 0%, rgba(250,249,247,0) 72%)",
                      }}
                    />
                    <div className="relative flex items-center justify-center px-6 pt-10 pb-6 md:px-10 md:pt-14 md:pb-8">
                      <DeviceMock device={device} caseFinish={caseFinish} model={model} />
                    </div>
                    {/* Plakette */}
                    <div
                      className="relative border-t px-6 py-5 md:px-10 flex items-center justify-between gap-4"
                      style={{ borderColor: H.line, background: "rgba(255,255,255,0.55)" }}
                    >
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: H.gold }}>
                          {caseFinish.name}
                        </p>
                        <p className="mt-1.5 text-sm font-light" style={{ color: H.text }}>
                          {model.name} · {device.name}
                        </p>
                      </div>
                      <span
                        className="text-[10px] uppercase tracking-[0.28em] whitespace-nowrap"
                        style={{ color: H.textMuted }}
                      >
                        {model.display}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Auswahl */}
                <div className="md:col-span-6 space-y-10">

                  {/* Modell */}
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] mb-4" style={{ color: H.textMuted }}>
                      Modell
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {MODELS.map((m) => {
                        const active = m.id === modelId;
                        return (
                          <button
                            key={m.id}
                            onClick={() => selectModel(m.id)}
                            aria-pressed={active}
                            className="text-left px-4 py-3 rounded-lg transition-all duration-300"
                            style={{
                              border: `1px solid ${active ? H.gold : H.line}`,
                              background: active ? "rgba(155,107,63,0.06)" : "transparent",
                            }}
                          >
                            <span className="block text-sm font-medium">iPhone {m.short}</span>
                            <span className="block text-[11px] mt-0.5" style={{ color: H.textMuted }}>
                              {m.display} · {m.status}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Gerätefarbe */}
                  <div>
                    <div className="flex items-baseline justify-between mb-4">
                      <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: H.textMuted }}>
                        Gerätefarbe
                      </p>
                      <p className="text-xs" style={{ color: H.text }}>{device.name}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {finishes.map((f) => {
                        const active = f.id === device.id;
                        return (
                          <button
                            key={f.id}
                            onClick={() => setDeviceId(f.id)}
                            aria-label={f.name}
                            aria-pressed={active}
                            className="relative w-9 h-9 rounded-full transition-transform duration-300 hover:scale-105"
                            style={{
                              background: `linear-gradient(145deg, ${f.body}, ${f.bodyEdge})`,
                              boxShadow: active
                                ? `0 0 0 1.5px ${H.bg}, 0 0 0 3px ${H.gold}`
                                : `0 0 0 1px ${H.lineStrong}`,
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Hüllenfinish */}
                  <div>
                    <div className="flex items-baseline justify-between mb-4">
                      <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: H.textMuted }}>
                        Finish
                      </p>
                      <p className="text-xs" style={{ color: H.text }}>
                        {caseFinish.material}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {CASE_FINISHES.map((c) => {
                        const active = c.id === caseId;
                        return (
                          <button
                            key={c.id}
                            onClick={() => setCaseId(c.id)}
                            aria-pressed={active}
                            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300"
                            style={{
                              border: `1px solid ${active ? H.gold : H.line}`,
                              background: active ? "rgba(155,107,63,0.06)" : "transparent",
                            }}
                          >
                            <span
                              className="w-6 h-6 rounded-full shrink-0"
                              style={{
                                background: `linear-gradient(145deg, ${c.weave}, ${c.base} 55%, ${c.edge})`,
                                boxShadow: `0 0 0 1px ${H.lineStrong}`,
                              }}
                            />
                            <span className="flex-1 text-left text-sm font-medium">{c.name}</span>
                            <span className="text-xs" style={{ color: H.textMuted }}>
                              CHF {c.price}.–
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-2 flex items-center justify-between gap-6 border-t" style={{ borderColor: H.line }}>
                    <span className="pt-6 font-light" style={{ fontSize: "clamp(22px,2vw,28px)" }}>
                      CHF {caseFinish.price}.–
                    </span>
                    <Link
                      to="/kontakt"
                      className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-medium border-b pb-1 transition-opacity hover:opacity-70"
                      style={{ color: H.gold, borderColor: H.gold }}
                    >
                      Auf die Warteliste
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Matrix-Tabelle */}
          <section className="border-t" style={{ borderColor: H.line }}>
            <div className="container mx-auto px-6 max-w-5xl py-14 md:py-20">
              <h2 className="font-light tracking-tight mb-8" style={{ fontSize: "clamp(28px,3.5vw,44px)" }}>
                Die Matrix
              </h2>
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="text-left font-normal pb-4 pr-4 align-bottom" style={{ color: H.textMuted }}>
                        <span className="text-[10px] uppercase tracking-[0.28em]">Merkmal</span>
                      </th>
                      {CASE_FINISHES.map((c) => (
                        <th key={c.id} className="pb-4 px-3 align-bottom">
                          <span
                            className="mx-auto mb-2 block w-5 h-5 rounded-full"
                            style={{
                              background: `linear-gradient(145deg, ${c.weave}, ${c.base} 55%, ${c.edge})`,
                              boxShadow: `0 0 0 1px ${H.lineStrong}`,
                            }}
                          />
                          <span className="block text-xs font-medium">{c.name}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MATRIX_ROWS.map((row) => (
                      <tr key={row.label} className="border-t" style={{ borderColor: H.line }}>
                        <td className="py-4 pr-4" style={{ color: H.text }}>
                          {row.label}
                        </td>
                        {CASE_FINISHES.map((c) => {
                          const v = row.values[c.id];
                          return (
                            <td key={c.id} className="py-4 px-3 text-center">
                              {typeof v === "boolean" ? (
                                v ? (
                                  <Check className="w-4 h-4 mx-auto" style={{ color: H.gold }} />
                                ) : (
                                  <Minus className="w-4 h-4 mx-auto" style={{ color: H.line }} />
                                )
                              ) : (
                                <span style={{ color: H.textMuted }}>{v}</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    <tr className="border-t" style={{ borderColor: H.line }}>
                      <td className="py-4 pr-4">Preis</td>
                      {CASE_FINISHES.map((c) => (
                        <td key={c.id} className="py-4 px-3 text-center font-medium">
                          CHF {c.price}.–
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Systempassung */}
          <section className="border-t" style={{ borderColor: H.line }}>
            <div className="container mx-auto px-6 max-w-5xl py-14 md:py-20">
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    name: "RAJ NEXUS",
                    text: "Der Magnetring der MATRIX sitzt 0,2 mm tiefer als die Norm verlangt. Das iPhone rastet auf dem NEXUS in derselben Position ein — mit oder ohne Hülle.",
                    link: "/nexus",
                  },
                  {
                    name: "RAJ APEX",
                    text: "Im Auto zählt Haltekraft. Die MATRIX ist auf den N52-Ring des APEX abgestimmt und bleibt auch auf Kopfsteinpflaster dort, wo sie hingehört.",
                    link: "/apex",
                  },
                ].map((s) => (
                  <Link
                    key={s.name}
                    to={s.link}
                    className="group block p-8 rounded-xl transition-colors duration-300"
                    style={{ border: `1px solid ${H.line}`, background: "#ffffff" }}
                  >
                    <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: H.gold }}>
                      Systempassung
                    </span>
                    <h3 className="mt-4 font-light" style={{ fontSize: "clamp(24px,2.4vw,32px)" }}>
                      {s.name}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed" style={{ color: H.textMuted }}>
                      {s.text}
                    </p>
                    <span
                      className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em]"
                      style={{ color: H.gold }}
                    >
                      Entdecken <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MatrixPage;
