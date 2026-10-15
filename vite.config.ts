import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { loadSnapshot, normalizeRoute, renderRouteHtml } from "./scripts/prerender";
import { componentTagger } from "lovable-tagger";
// @ts-expect-error - .mjs script without type declarations
import { generateSitemap } from "./scripts/generate-sitemap.mjs";
import heroWebp400 from "./src/assets/products/nexus-hero-v2-400w.webp.asset.json";
import heroWebp800 from "./src/assets/products/nexus-hero-v2-800w.webp.asset.json";
import heroWebp1200 from "./src/assets/products/nexus-hero-v2-1200w.webp.asset.json";
import matrixFirstRender from "./src/assets/matrix/optimized-renders/18-cherry-cherry-darkcherry.webp.asset.json";
import matrixMobileRender from "./src/assets/matrix/responsive/18-cherry-cherry-darkcherry-mobile.webp.asset.json";
import ap400 from "./src/assets/matrix/airpods-gallery/airpods-cherry-product-400.webp.asset.json";
import ap800 from "./src/assets/matrix/airpods-gallery/airpods-cherry-product-800.webp.asset.json";
import ap1200 from "./src/assets/matrix/airpods-gallery/airpods-cherry-product-1200.webp.asset.json";

// Must match GALLERY_SIZES / slideSrcSet of the first AirpodsPage slide so the preload is reused.
const airpodsPreload = `<link rel="preload" as="image" href="${ap1200.url}" imagesrcset="${ap400.url} 400w, ${ap800.url} 800w, ${ap1200.url} 1200w" imagesizes="(max-width: 767px) 100vw, 460px" fetchpriority="high">`;
// Visible purchase facts (button labels the snapshot capture skips), copied verbatim from the pages.
const PRODUCT_FACTS: Record<string, string> = {
  "/matrix": "<h2>Preis</h2><p>CHF 59.–</p><h3>Modell</h3><ul><li>iPhone 17 Pro</li><li>iPhone 17 Pro Max</li><li>iPhone 18 Pro</li><li>iPhone 18 Pro Max</li></ul><h3>Farbe der Hülle</h3><ul><li>Cherry Carbon</li><li>Onyx Carbon</li></ul><h3>Angebote</h3><ul><li>Nur die Hülle · CHF 59.–</li><li>Hülle + AirPods Case · CHF 79.–</li><li>2 Hüllen · CHF 99.–</li></ul>",
  "/airpods-case": "<h2>Preis</h2><p>CHF 35.–</p><h3>Kompatibel</h3><ul><li>AirPods 4 &amp; 5</li></ul><h3>Farbe der Hülle</h3><ul><li>Cherry Carbon</li><li>Onyx Carbon</li></ul><h3>Angebote</h3><ul><li>Nur die Hülle · CHF 35.–</li><li>Hülle + MATRIX iPhone Hülle · CHF 79.–</li></ul>",
  "/nexus": "<h2>Preis</h2><p>CHF 99.–</p><ul><li>Qi2.2 · 25 W</li><li>3 Jahre Garantie</li><li>MagSafe</li><li>Lieferung in 2–4 Werktagen</li><li>30 Tage Rückgabe</li></ul>",
};
const withFacts = (html: string, route: string) => PRODUCT_FACTS[route]
  ? html.replace(/(<noscript>\s*<div style="max-width:800px[^>]*>\s*<h1>[\s\S]*?<\/h1>)/, `$1${PRODUCT_FACTS[route]}`)
  : html;
// Static first-image preloads; must match the first React <img> src/srcset/sizes exactly.
const matrixPreload = `<link rel="preload" as="image" href="${matrixMobileRender.url}" imagesrcset="${matrixMobileRender.url} 800w, ${matrixFirstRender.url} 1200w" imagesizes="(max-width: 1023px) 266px, 1200px" fetchpriority="high">`;
const nexusPreload = `<link rel="preload" as="image" href="${heroWebp800.url}" imagesrcset="${heroWebp400.url} 400w, ${heroWebp800.url} 800w, ${heroWebp1200.url} 1200w" imagesizes="(max-width: 768px) 266px, 700px" fetchpriority="high">`;
const ROUTE_PRELOADS: Record<string, string> = { "/airpods-case": airpodsPreload, "/matrix": matrixPreload, "/nexus": nexusPreload };
// Page colour painted before the bundle so there is no white flash.
const pageBg = (route: string) => `<style>html,body{background:${route === "/matrix" || route === "/airpods-case" ? "#faf9f7" : "#fff"}}</style>`;

// Vite plugin: regenerates public/sitemap.xml from src/content/site-urls.ts
// before every build, and once on dev server start.
const sitemapPlugin = (): PluginOption => ({
  name: "raj-sitemap-generator",
  apply: () => true,
  async buildStart() {
    try {
      const { count } = await generateSitemap();
      this.info(`sitemap.xml regenerated (${count} URLs)`);
    } catch (err) {
      this.warn(`sitemap generation skipped: ${(err as Error).message}`);
    }
  },
});

// Vite plugin: injects a <link rel="preload"> for the Nexus LCP hero image
// into index.html. The hero image is served from the Lovable CDN, so the URLs
// are stable and can be imported directly from the asset pointer files.
// Replaces the <!--HERO_PRELOAD--> marker in index.html.
const heroPreloadPlugin = (): PluginOption => ({
  name: "raj-hero-preload",
  apply: () => true,
  transformIndexHtml: {
    order: "post",
    handler(html) {
      const url400 = heroWebp400.url;
      const url800 = heroWebp800.url;
      const url1200 = heroWebp1200.url;
      const srcset = `${url400} 400w, ${url800} 800w, ${url1200} 1200w`;

      // Single responsive preload — matches the <img srcset/sizes> on the
      // Nexus hero exactly, so the preloaded resource is guaranteed to be
      // reused instead of triggering a second download.
       const preloadTag = `<script>(function(){var _p=location.pathname.replace(/\\/$/,'');if(_p==='/matrix'||_p==='/airpods-case'||_p==='/nexus')return;var l=document.createElement('link');l.rel='preload';l.as='image';l.href=${JSON.stringify(url800)};l.imageSrcset=${JSON.stringify(srcset)};l.imageSizes=location.pathname.replace(/\\/$/,'')==='/nexus'?'(max-width: 768px) 100vw, 700px':'100vw';l.setAttribute('fetchpriority','high');document.head.appendChild(l);})();</script>`;

      // Static LCP fallback: inject a real <img> into #root so the browser
      // can paint the hero BEFORE React hydrates (~3s render-delay saved on
      // mobile). Only rendered on /nexus and / (the two routes whose LCP is
      // this image). React wipes #root's children on mount, so this is
      // automatically removed once the SPA takes over.

      // /matrix instant shell: preload the default render (18 Pro, Cherry
      // Carbon, Dark Cherry) and paint a static header/image/title/price/buy
      // block before the JS bundle arrives. MatrixPage removes it on mount.
      return html.replace("<!--HERO_PRELOAD-->", preloadTag);
    },
  },
});



// Vite plugin: per-route static HTML for crawlers without JavaScript.
// Dev: the served index.html is rewritten for the requested route.
// Build: emits <route>/index.html and <route>.html for every snapshot route
// and rewrites index.html with the "/" snapshot.
const prerenderPlugin = (): PluginOption => {
  const snapshot = loadSnapshot(__dirname);
  const VIEWPORT = '<meta name="viewport" content="width=device-width, initial-scale=1.0" />';
  const withShell = (html: string, route: string) =>
    withFacts(html, route).replace(VIEWPORT, VIEWPORT + pageBg(route) + (ROUTE_PRELOADS[route] ?? ""));
  return {
    name: "raj-prerender",
    enforce: "post",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        if (!ctx.server) return html;
        const route = normalizeRoute(ctx.originalUrl);
        const snap = loadSnapshot(__dirname)[route];
        return withShell(snap ? renderRouteHtml(html, snap) : html, route);
      },
    },
    generateBundle(_opts, bundle) {
      const asset = bundle["index.html"];
      if (!asset || asset.type !== "asset") return;
      const base = String(asset.source);
      for (const [route, snap] of Object.entries(snapshot)) {
        const html = withShell(renderRouteHtml(base, snap), route);
        if (route === "/") {
          asset.source = html;
          continue;
        }
        const rel = route.replace(/^\//, "");
        this.emitFile({ type: "asset", fileName: `${rel}/index.html`, source: html });
        this.emitFile({ type: "asset", fileName: `${rel}.html`, source: html });
      }
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    sitemapPlugin(),
    heroPreloadPlugin(),
    prerenderPlugin(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    // Providers and the renderer must share one React hook dispatcher.
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    // Prebundle the shell providers up front instead of rediscovering them
    // during lazy navigation and mixing dependency generations in open tabs.
    include: [
      "react", "react-dom", "react-dom/client", "react/jsx-runtime",
      "react/jsx-dev-runtime", "@tanstack/react-query", "react-helmet-async",
      "react-router-dom",
    ],
  },
  build: {
    target: "es2022",
    cssCodeSplit: true,
    sourcemap: false,
    minify: "esbuild",
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React stays together (always needed)
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          // Animations - heavy, used on most pages but can be cached separately
          "motion-vendor": ["framer-motion"],
          // Supabase client - only needed for forms / data
          "supabase-vendor": ["@supabase/supabase-js"],
          // Data layer + meta tags
          "data-vendor": ["@tanstack/react-query", "react-helmet-async"],
          // Form / validation libs
          "form-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],
        },
      },
    },
  },
}));
