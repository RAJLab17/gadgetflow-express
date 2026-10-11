/**
 * Build-time prerender of per-route SEO HTML.
 *
 * Uses src/content/prerender-snapshot.json (captured from the rendered app by
 * scripts/capture-seo-snapshot.py) to give every sitemap route its own static
 * <head> (title, description, canonical, og:*, twitter:*, JSON-LD) and its own
 * H1 + main text inside <noscript>. React still mounts into an empty #root, so
 * design, tracking and checkout are untouched; react-helmet-async takes over
 * the data-rh tags after mount.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

export interface RouteSnapshot {
  title: string;
  description: string | null;
  robots: string | null;
  canonical: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogUrl: string | null;
  ogImage: string | null;
  ogImageWidth?: string | null;
  ogImageHeight?: string | null;
  ogImageType?: string | null;
  ogImageAlt?: string | null;
  ogType: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  h1: string | null;
  jsonLd: string[];
  blocks: { tag: string; text: string }[];
}

const MAX_PRERENDER_PAGES = 500;

export function loadSnapshot(root: string): Record<string, RouteSnapshot> {
  try {
    const raw = readFileSync(path.resolve(root, "src/content/prerender-snapshot.json"), "utf8");
    const all = JSON.parse(raw) as Record<string, RouteSnapshot>;
    return Object.fromEntries(Object.entries(all).slice(0, MAX_PRERENDER_PAGES));
  } catch {
    return {};
  }
}

export function normalizeRoute(url: string | undefined): string {
  const p = (url || "/").split(/[?#]/)[0] || "/";
  return p.length > 1 ? p.replace(/\/+$/, "") : "/";
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const HEAD_TAG_PATTERNS: RegExp[] = [
  /<title>[\s\S]*?<\/title>\s*/,
  /<meta[^>]*name="description"[^>]*>\s*/g,
  /<meta[^>]*name="robots"[^>]*>\s*/g,
  /<link[^>]*rel="canonical"[^>]*>\s*/g,
  /<meta[^>]*property="og:(title|description|type|url|image(?::width|:height|:type|:alt)?)"[^>]*>\s*/g,
  /<meta[^>]*name="twitter:(title|description|image)"[^>]*>\s*/g,
];

export function renderRouteHtml(html: string, snap: RouteSnapshot): string {
  let out = html;
  for (const re of HEAD_TAG_PATTERNS) out = out.replace(re, "");

  const canonical = snap.canonical || "https://raj.ch/";
  const desc = snap.description || "";
  const meta = (attr: "name" | "property", key: string, val: string | null) =>
    val ? `<meta data-rh="true" ${attr}="${key}" content="${esc(val)}" />` : "";

  const head = [
    `<title>${esc(snap.title)}</title>`,
    meta("name", "description", desc),
    meta("name", "robots", snap.robots || "index, follow"),
    `<link data-rh="true" rel="canonical" href="${esc(canonical)}" />`,
    meta("property", "og:title", snap.ogTitle || snap.title),
    meta("property", "og:description", snap.ogDescription || desc),
    meta("property", "og:type", snap.ogType || "website"),
    meta("property", "og:url", snap.ogUrl || canonical),
    meta("property", "og:image", snap.ogImage),
    meta("property", "og:image:width", snap.ogImageWidth || null),
    meta("property", "og:image:height", snap.ogImageHeight || null),
    meta("property", "og:image:type", snap.ogImageType || null),
    meta("property", "og:image:alt", snap.ogImageAlt || null),
    meta("name", "twitter:title", snap.twitterTitle || snap.title),
    meta("name", "twitter:description", snap.twitterDescription || desc),
    meta("name", "twitter:image", snap.twitterImage || snap.ogImage),
    ...snap.jsonLd.map(
      (j) => `<script data-rh="true" type="application/ld+json">${j.replace(/<\//g, "<\\/")}</script>`,
    ),
  ]
    .filter(Boolean)
    .join("\n    ");

  // Title first so it stays early in <head>; the rest before </head>.
  out = out.replace(
    /(<meta name="viewport"[^>]*>)/,
    `$1\n    ${head.split("\n    ")[0]}`,
  );
  out = out.replace("</head>", `    ${head.split("\n    ").slice(1).join("\n    ")}\n  </head>`);

  // hreflang alternates point at this page.
  out = out.replace(/(<link rel="alternate" hreflang="[^"]+" href=")https:\/\/raj\.ch\/(")/g, `$1${esc(canonical)}$2`);

  // Per-page fallback content for non-JS crawlers.
  const body: string[] = [];
  if (snap.h1) body.push(`<h1>${esc(snap.h1)}</h1>`);
  let inList = false;
  for (const b of snap.blocks) {
    if (b.tag === "h1" && b.text === snap.h1) continue;
    if (b.tag === "li" && !inList) { body.push("<ul>"); inList = true; }
    if (b.tag !== "li" && inList) { body.push("</ul>"); inList = false; }
    const tag = ["h1", "h2", "h3", "li"].includes(b.tag) ? (b.tag === "h1" ? "h2" : b.tag) : "p";
    body.push(`<${tag}>${esc(b.text)}</${tag}>`);
  }
  if (inList) body.push("</ul>");
  const noscript = `<noscript>\n      <div style="max-width:800px;margin:0 auto;padding:40px 20px;font-family:sans-serif;color:#333;">\n        ${body.join("\n        ")}\n      </div>\n    </noscript>`;
  out = out.replace(/<noscript>\s*<div style="max-width:800px[\s\S]*?<\/noscript>/, noscript);
  return out;
}
