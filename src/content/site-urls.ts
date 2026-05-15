/**
 * Zentrale Quelle der Wahrheit für alle indexierbaren URLs der RAJ-Website.
 *
 * Wird sowohl zur Laufzeit (z.B. BlogPage) als auch beim Build
 * (scripts/generate-sitemap.mjs → public/sitemap.xml) verwendet.
 *
 * Neuen Blogartikel hinzufügen:
 *   1. .tsx-Page erstellen + Route in src/App.tsx registrieren
 *   2. Eintrag in BLOG_ARTICLES unten ergänzen — fertig.
 *      Sitemap wird beim nächsten Build automatisch aktualisiert.
 */

export const SITE_URL = "https://raj.ch";

export interface SitemapImage {
  loc: string;
  title?: string;
  caption?: string;
}

export interface SitemapEntry {
  /** Absolute path beginning with "/" */
  path: string;
  lastmod: string; // YYYY-MM-DD
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
  images?: SitemapImage[];
}

export interface BlogArticle {
  slug: string;
  /** Path used in routing & sitemap, e.g. "/blog/foo" or "/qi2-erklaert" */
  path: string;
  title: string;
  excerpt: string;
  /** Display date, e.g. "03.05.2026" */
  date: string;
  /** ISO date for <time> + sitemap lastmod, e.g. "2026-05-03" */
  dateISO: string;
  priority?: number;
  changefreq?: SitemapEntry["changefreq"];
}

// ---------------------------------------------------------------------------
// BLOG ARTICLES — Single source of truth for /blog index + sitemap
// ---------------------------------------------------------------------------
export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "bester-3in1-wireless-charger-schweiz-2026",
    path: "/blog/bester-3in1-wireless-charger-schweiz-2026",
    title: "Beste 3-in-1 Wireless Ladestation Schweiz 2026 – Qi2.2 Vergleich",
    excerpt:
      "Drei Geräte, ein Ladegerät. RAJ NEXUS, Anker, Belkin & ESR im direkten Qi2.2-Vergleich für die Schweiz.",
    date: "04.05.2026",
    dateISO: "2026-05-04",
    priority: 0.85,
  },
  {
    slug: "3-in-1-ladestation-apple",
    path: "/3-in-1-ladestation-iphone-apple-watch-airpods",
    title:
      "3-in-1 Ladestation iPhone Apple Watch AirPods – die beste Lösung 2026",
    excerpt:
      "Drei Geräte, ein Ladegerät. Die beste 3-in-1 Ladestation für Apple-Nutzer in der Schweiz.",
    date: "03.05.2026",
    dateISO: "2026-05-03",
    priority: 0.85,
  },
  {
    slug: "magsafe-ladestation-schweiz",
    path: "/magsafe-ladestation-schweiz",
    title:
      "MagSafe kompatible Ladestation Schweiz – was bedeutet das wirklich?",
    excerpt:
      "Nicht alles was MagSafe-kompatibel heisst ist gleich gut. Was du wissen musst bevor du kaufst.",
    date: "03.05.2026",
    dateISO: "2026-05-03",
  },
  {
    slug: "iphone-standby-ladestation",
    path: "/iphone-standby-ladestation-schweiz",
    title: "iPhone StandBy Modus – Die perfekte Ladestation",
    excerpt:
      "StandBy ist Apples beste Nachttisch-Funktion. Was du brauchst um sie optimal zu nutzen.",
    date: "03.05.2026",
    dateISO: "2026-05-03",
  },
  {
    slug: "qi2-vs-qi22",
    path: "/qi2-erklaert",
    title: "Qi2 vs. Qi2.2 – Was ist der Unterschied?",
    excerpt:
      "Qi2.2 ist der neue Standard. Was sich geändert hat und was das für dein iPhone bedeutet.",
    date: "02.05.2026",
    dateISO: "2026-05-02",
  },
  {
    slug: "nexus-vs-belkin-vs-anker",
    path: "/vergleich",
    title: "RAJ NEXUS vs. Belkin vs. Anker – Welcher lohnt sich?",
    excerpt:
      "Direkter Vergleich der drei beliebtesten 3-in-1 Wireless Charger für iPhone. Qi2.2, Preis, Design.",
    date: "02.05.2026",
    dateISO: "2026-05-02",
  },
  {
    slug: "bester-wireless-charger-schweiz-2026",
    path: "/bester-wireless-charger-schweiz",
    title: "Bester Wireless Charger Schweiz 2026 – Top 3 im Vergleich",
    excerpt:
      "Qi2.2, MagSafe, 3-in-1 – welcher Charger lohnt sich wirklich für iPhone-Nutzer in der Schweiz?",
    date: "02.05.2026",
    dateISO: "2026-05-02",
  },
  {
    slug: "kabelloses-laden-buero-schweiz",
    path: "/kabelloses-laden-buero-schweiz",
    title:
      "Kabelloses Laden im Büro – Kabelsalat eliminieren für Schweizer KMUs",
    excerpt:
      "Ein Gerät pro Arbeitsplatz statt drei Kabel. Wie Schweizer Unternehmen mit Qi2.2 Ordnung schaffen.",
    date: "02.05.2026",
    dateISO: "2026-05-02",
  },
  {
    slug: "kabelloses-laden-firmen-schweiz",
    path: "/kabelloses-laden-firmen-schweiz",
    title:
      "Kabelloses Laden für Unternehmen – Sicherheit und Ordnung für Schweizer KMUs",
    excerpt:
      "Mitarbeitende bringen eigene Ladekabel mit – ein unterschätztes Risiko. Wie KMUs das eleganter lösen.",
    date: "02.05.2026",
    dateISO: "2026-05-02",
  },
];

// ---------------------------------------------------------------------------
// STATIC URLS — non-blog pages that should be in the sitemap
// ---------------------------------------------------------------------------
const TODAY = "2026-05-04";

export const STATIC_URLS: SitemapEntry[] = [
  // Hauptseite
  {
    path: "/",
    lastmod: TODAY,
    changefreq: "daily",
    priority: 1.0,
    images: [
      {
        loc: `${SITE_URL}/raj-logo.png`,
        title: "RAJ Logo - Swiss Premium Wireless Charging",
        caption: "Offizielles Logo der Marke RAJ - Power. Always There.",
      },
      {
        loc: `${SITE_URL}/favicon.png`,
        title: "RAJ Favicon",
        caption: "RAJ Brand Icon",
      },
      {
        loc: `${SITE_URL}/og-image.webp`,
        title: "RAJ NEXUS - Open Graph Bild",
        caption: "RAJ NEXUS 3-in-1 Wireless Charger Vorschaubild",
      },
      {
        loc: `${SITE_URL}/raj-nexus-product.png`,
        title: "RAJ NEXUS 3-in-1 Wireless Charger",
        caption:
          "Premium 3-in-1 Qi2.2 Wireless Charger für iPhone, Apple Watch und AirPods",
      },
      {
        loc: `${SITE_URL}/hero/hero-1-bedside.webp`,
        title: "RAJ NEXUS am Nachttisch",
        caption:
          "RAJ NEXUS 3-in-1 Ladestation lädt iPhone, Apple Watch und AirPods kabellos über Nacht",
      },
    ],
  },
  { path: "/shop", lastmod: TODAY, changefreq: "daily", priority: 0.9 },
  { path: "/?mode=shop", lastmod: TODAY, changefreq: "weekly", priority: 0.8 },
  {
    path: "/nexus",
    lastmod: TODAY,
    changefreq: "weekly",
    priority: 0.95,
    images: [
      {
        loc: `${SITE_URL}/raj-nexus-hero-800.webp`,
        title: "RAJ NEXUS 3-in-1 Wireless Charger – Hero",
        caption:
          "RAJ NEXUS Premium 3-in-1 Qi2.2 Wireless Charger für iPhone, Apple Watch und AirPods",
      },
      {
        loc: `${SITE_URL}/raj-nexus-folding-800.webp`,
        title: "RAJ NEXUS Faltmechanismus",
        caption:
          "RAJ NEXUS faltbares Design – kompakt für unterwegs und elegant zu Hause",
      },
      {
        loc: `${SITE_URL}/raj-nexus-folded-side-800.webp`,
        title: "RAJ NEXUS gefaltet – Seitenansicht",
        caption: "RAJ NEXUS im gefalteten Zustand – Seitenprofil",
      },
      {
        loc: `${SITE_URL}/raj-nexus-lifestyle-1-800.webp`,
        title: "RAJ NEXUS Lifestyle 1",
        caption: "RAJ NEXUS im Alltag – Premium kabelloses Laden",
      },
      {
        loc: `${SITE_URL}/raj-nexus-lifestyle-2-800.webp`,
        title: "RAJ NEXUS Lifestyle 2",
        caption: "RAJ NEXUS Lifestyle – iPhone, Apple Watch und AirPods kabellos laden",
      },
      {
        loc: `${SITE_URL}/hero/hero-1-bedside.webp`,
        title: "RAJ NEXUS am Nachttisch",
        caption:
          "RAJ NEXUS 3-in-1 Ladestation lädt iPhone, Apple Watch und AirPods kabellos über Nacht",
      },
      {
        loc: `${SITE_URL}/lifestyle/lifestyle-laptop.webp`,
        title: "RAJ NEXUS am Arbeitsplatz",
        caption: "RAJ NEXUS neben dem Laptop – kabelloses Laden im Büro",
      },
      {
        loc: `${SITE_URL}/lifestyle/lifestyle-woman.webp`,
        title: "RAJ NEXUS Lifestyle",
        caption: "RAJ NEXUS im modernen Schweizer Wohnambiente",
      },
    ],
  },

  // Produkte – derzeit nur RAJ NEXUS aktiv (siehe /nexus oben).
  // Andere /product/* Routen sind als noindex markiert und nicht in der Sitemap.

  // Info
  { path: "/about", lastmod: TODAY, changefreq: "monthly", priority: 0.7 },
  { path: "/ueber-raj", lastmod: TODAY, changefreq: "monthly", priority: 0.7 },
  { path: "/faq", lastmod: TODAY, changefreq: "monthly", priority: 0.7 },
  { path: "/versand", lastmod: TODAY, changefreq: "monthly", priority: 0.6 },

  // Blog index
  { path: "/blog", lastmod: TODAY, changefreq: "weekly", priority: 0.8 },

  // Dokumente
  { path: "/dokumente", lastmod: TODAY, changefreq: "monthly", priority: 0.6 },
  { path: "/manuals", lastmod: TODAY, changefreq: "monthly", priority: 0.6 },

  // Rechtliches
  { path: "/agb", lastmod: TODAY, changefreq: "yearly", priority: 0.3 },
  { path: "/datenschutz", lastmod: TODAY, changefreq: "yearly", priority: 0.3 },
  { path: "/impressum", lastmod: TODAY, changefreq: "yearly", priority: 0.3 },
];

/**
 * Vereinte Sitemap-Einträge: statische URLs + alle Blogartikel.
 * Doppelte Pfade werden automatisch dedupliziert (statische URL gewinnt).
 */
export function getAllSitemapEntries(): SitemapEntry[] {
  const seen = new Set(STATIC_URLS.map((u) => u.path));
  const blogEntries: SitemapEntry[] = BLOG_ARTICLES.filter(
    (a) => !seen.has(a.path),
  ).map((a) => ({
    path: a.path,
    lastmod: a.dateISO,
    changefreq: a.changefreq ?? "weekly",
    priority: a.priority ?? 0.8,
  }));
  return [...STATIC_URLS, ...blogEntries];
}
