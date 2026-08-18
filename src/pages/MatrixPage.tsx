import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Check, Minus, ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  /** relative visual size of the device mock */
  scale: number;
  status: string;
}

const MODELS: Model[] = [
  { id: "17pro", short: "17 Pro", name: "iPhone 17 Pro", gen: "17", display: '6,3"', scale: 0.94, status: "Verfügbar" },
  { id: "17promax", short: "17 Pro Max", name: "iPhone 17 Pro Max", gen: "17", display: '6,9"', scale: 1, status: "Verfügbar" },
  { id: "18pro", short: "18 Pro", name: "iPhone 18 Pro", gen: "18", display: '6,3"', scale: 0.94, status: "Vorbestellung" },
  { id: "18promax", short: "18 Pro Max", name: "iPhone 18 Pro Max", gen: "18", display: '6,9"', scale: 1, status: "Vorbestellung" },
];

interface DeviceFinish {
  id: string;
  name: string;
  body: string;
  bodyEdge: string;
  gens: ("17" | "18")[];
}

/** Gerätefarben — sichtbar durch die Aussparungen und die Rückseite der Hülle. */
const DEVICE_FINISHES: DeviceFinish[] = [
  { id: "orange", name: "Cosmic Orange", body: "#d4622a", bodyEdge: "#a8481c", gens: ["17"] },
  { id: "blue", name: "Deep Blue", body: "#33445f", bodyEdge: "#222f42", gens: ["17", "18"] },
  { id: "silver", name: "Silver", body: "#d9dadc", bodyEdge: "#a9abae", gens: ["17", "18"] },
  { id: "black", name: "Space Black", body: "#2a2a2c", bodyEdge: "#151516", gens: ["17", "18"] },
  { id: "titan", name: "Natural Titanium", body: "#c2bcb2", bodyEdge: "#948d82", gens: ["18"] },
  { id: "burgundy", name: "Burgundy", body: "#6d2434", bodyEdge: "#4a1723", gens: ["18"] },
];

interface CaseFinish {
  id: string;
  name: string;
  material: string;
  /** 0 = vollständig deckend, 1 = vollkommen klar */
  clarity: number;
  tint: string;
  ring: string;
  price: number;
}

const CASE_FINISHES: CaseFinish[] = [
  { id: "clear", name: "Crystal", material: "Polycarbonat, klar", clarity: 0.88, tint: "rgba(255,255,255,0.10)", ring: "#cfd3d6", price: 39 },
  { id: "onyx", name: "Onyx", material: "Silikon, matt", clarity: 0, tint: "#1d1c1b", ring: "#1d1c1b", price: 45 },
  { id: "sand", name: "Sand", material: "Silikon, matt", clarity: 0, tint: "#d8cdbc", ring: "#d8cdbc", price: 45 },
  { id: "cognac", name: "Cognac", material: "Leder, pflanzlich gegerbt", clarity: 0, tint: "#8a5a33", ring: "#8a5a33", price: 69 },
  { id: "graphite", name: "Graphite", material: "Aramid, 0,9 mm", clarity: 0, tint: "#3a3d40", ring: "#3a3d40", price: 79 },
];

interface Row {
  label: string;
  values: Record<string, string | boolean>;
}

const MATRIX_ROWS: Row[] = [
  { label: "MagSafe Magnetring (N52)", values: { clear: true, onyx: true, sand: true, cognac: true, graphite: true } },
  { label: "Qi2.2 · 25 W ohne Verlust", values: { clear: true, onyx: true, sand: true, cognac: true, graphite: true } },
  { label: "RAJ NEXUS kompatibel", values: { clear: true, onyx: true, sand: true, cognac: true, graphite: true } },
  { label: "RAJ APEX kompatibel", values: { clear: true, onyx: true, sand: true, cognac: true, graphite: true } },
  { label: "Materialstärke", values: { clear: "1,4 mm", onyx: "1,6 mm", sand: "1,6 mm", cognac: "1,5 mm", graphite: "0,9 mm" } },
  { label: "Falltest", values: { clear: "2,5 m", onyx: "3 m", sand: "3 m", cognac: "2,5 m", graphite: "4 m" } },
  { label: "Kameraring Metall", values: { clear: true, onyx: true, sand: true, cognac: true, graphite: true } },
  { label: "Gerätefarbe sichtbar", values: { clear: true, onyx: false, sand: false, cognac: false, graphite: false } },
];

/* ── Visual: Gerät in Hülle ───────────────────────────────────────────── */
const DeviceMock = ({
  device,
  caseFinish,
  scale,
}: {
  device: DeviceFinish;
  caseFinish: CaseFinish;
  scale: number;
}) => {
  const clear = caseFinish.clarity > 0.5;
  return (
    <div
      className="relative mx-auto transition-all duration-500 ease-out"
      style={{ width: 232 * scale, height: 470 * scale }}
    >
      {/* Schatten */}
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 bottom-[-26px] w-[70%] h-8 rounded-full"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(43,39,37,0.22), transparent 70%)" }}
      />
      {/* Hülle */}
      <div
        className="absolute inset-0 rounded-[13%] transition-colors duration-500"
        style={{
          background: clear ? device.body : caseFinish.tint,
          boxShadow: `inset 0 0 0 1.5px rgba(255,255,255,0.14), 0 26px 50px -18px rgba(43,39,37,0.45)`,
        }}
      >
        {/* Geräterückseite (durch klare Hülle sichtbar) */}
        <div
          className="absolute inset-[3%] rounded-[11%] transition-colors duration-500"
          style={{
            background: clear
              ? `linear-gradient(150deg, ${device.body}, ${device.bodyEdge})`
              : `linear-gradient(150deg, ${caseFinish.tint}, rgba(0,0,0,0.18))`,
            opacity: clear ? 1 : 0.92,
          }}
        />
        {/* Glanzkante */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-[13%] pointer-events-none"
          style={{
            background:
              "linear-gradient(115deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 32%, rgba(255,255,255,0) 68%, rgba(255,255,255,0.12) 100%)",
          }}
        />

        {/* Kameraplateau — Gerätefarbe immer sichtbar */}
        <div
          className="absolute rounded-[22%] transition-colors duration-500"
          style={{
            left: "7%",
            top: "4.5%",
            width: "48%",
            height: "23%",
            background: `linear-gradient(150deg, ${device.body}, ${device.bodyEdge})`,
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18), 0 6px 14px -6px rgba(0,0,0,0.5)",
          }}
        >
          {[
            { l: "10%", t: "16%" },
            { l: "52%", t: "16%" },
            { l: "10%", t: "56%" },
          ].map((p) => (
            <span
              key={`${p.l}${p.t}`}
              className="absolute rounded-full"
              style={{
                left: p.l,
                top: p.t,
                width: "38%",
                aspectRatio: "1",
                background: "radial-gradient(circle at 35% 30%, #4a4d52 0%, #17181a 55%, #0a0a0b 100%)",
                boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.16)",
              }}
            />
          ))}
        </div>

        {/* MagSafe Ring */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            top: "44%",
            width: "42%",
            aspectRatio: "1",
            border: "1px dashed rgba(255,255,255,0.22)",
          }}
        />
        {/* Gravur */}
        <span
          className="absolute left-1/2 -translate-x-1/2 bottom-[7%] text-[9px] tracking-[0.4em]"
          style={{ color: clear ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.35)" }}
        >
          RAJ
        </span>
      </div>
    </div>
  );
};

/* ── Page ─────────────────────────────────────────────────────────────── */
const MatrixPage = () => {
  const [modelId, setModelId] = useState<ModelId>("17promax");
  const [deviceId, setDeviceId] = useState("orange");
  const [caseId, setCaseId] = useState("clear");

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
      "RAJ MATRIX — MagSafe-Cases für iPhone 17 Pro, 17 Pro Max, 18 Pro und 18 Pro Max. Qi2.2-kompatibel, abgestimmt auf RAJ NEXUS und RAJ APEX.",
    url: "https://raj.ch/matrix",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "CHF",
      lowPrice: 39,
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
          content="RAJ MATRIX Cases für iPhone 17 Pro, 17 Pro Max, 18 Pro und 18 Pro Max. Fünf Finishes, Qi2.2 mit 25 W, perfekt abgestimmt auf RAJ NEXUS und RAJ APEX."
        />
        <link rel="canonical" href="https://raj.ch/matrix" />
        <meta property="og:title" content="RAJ MATRIX — MagSafe Cases für iPhone 17 & 18 Pro" />
        <meta
          property="og:description"
          content="Fünf Finishes, vier Modelle, ein System. Qi2.2 mit 25 W, abgestimmt auf RAJ NEXUS und RAJ APEX."
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
              Vier Modelle, fünf Finishes, ein Magnetring. Jede MATRIX-Hülle ist so vermessen, dass NEXUS und APEX
              magnetisch einrasten, als wäre nichts dazwischen. Die Farbe deines iPhones bleibt Teil des Objekts.
            </p>
          </section>

          {/* Konfigurator */}
          <section className="border-t" style={{ borderColor: H.line }}>
            <div className="container mx-auto px-6 max-w-5xl py-12 md:py-20">
              <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-start">
                {/* Bühne */}
                <div className="md:col-span-5 md:sticky md:top-28">
                  <div className="relative flex items-center justify-center py-8">
                    <div
                      aria-hidden
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(50% 50% at 50% 50%, rgba(155,107,63,0.10) 0%, rgba(250,249,247,0) 70%)",
                      }}
                    />
                    <DeviceMock device={device} caseFinish={caseFinish} scale={model.scale} />
                  </div>
                  <p
                    className="text-center mt-10 text-[10px] uppercase tracking-[0.28em]"
                    style={{ color: H.textMuted }}
                  >
                    {model.name} · {device.name} · {caseFinish.name}
                  </p>
                </div>

                {/* Auswahl */}
                <div className="md:col-span-7 space-y-10">
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
                                background:
                                  c.clarity > 0.5
                                    ? "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(200,205,210,0.7))"
                                    : c.tint,
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
                              background:
                                c.clarity > 0.5
                                  ? "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(200,205,210,0.7))"
                                  : c.tint,
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
