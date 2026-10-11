import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { readFileSync } from "node:fs";
import { matrixShellHtml, matrixShellScript as makeMatrixShellScript } from "./scripts/matrix-shell";
import { loadSnapshot, normalizeRoute, renderRouteHtml } from "./scripts/prerender";
import { componentTagger } from "lovable-tagger";
// @ts-expect-error - .mjs script without type declarations
import { generateSitemap } from "./scripts/generate-sitemap.mjs";
import heroWebp400 from "./src/assets/products/nexus-hero-v2-400w.webp.asset.json";
import heroWebp800 from "./src/assets/products/nexus-hero-v2-800w.webp.asset.json";
import heroWebp1200 from "./src/assets/products/nexus-hero-v2-1200w.webp.asset.json";
import matrixFirstRender from "./src/assets/matrix/optimized-renders/18-cherry-cherry-darkcherry.webp.asset.json";
import matrixMobileRender from "./src/assets/matrix/responsive/18-cherry-cherry-darkcherry-mobile.webp.asset.json";

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
      const preloadTag = `<script>(function(){if(location.pathname.replace(/\\/$/,'')==='/matrix')return;var l=document.createElement('link');l.rel='preload';l.as='image';l.href=${JSON.stringify(url800)};l.imageSrcset=${JSON.stringify(srcset)};l.imageSizes='100vw';l.setAttribute('fetchpriority','high');document.head.appendChild(l);})();</script>`;

      // Static LCP fallback: inject a real <img> into #root so the browser
      // can paint the hero BEFORE React hydrates (~3s render-delay saved on
      // mobile). Only rendered on /nexus and / (the two routes whose LCP is
      // this image). React wipes #root's children on mount, so this is
      // automatically removed once the SPA takes over.
      const fallbackScript = `<script>(function(){try{if(location.pathname!=='/nexus')return;var r=document.getElementById('root');if(!r)return;var img=document.createElement('img');img.src=${JSON.stringify(url800)};img.srcset=${JSON.stringify(srcset)};img.sizes='100vw';img.alt='RAJ NEXUS 3-in-1 Wireless Charger';img.fetchPriority='high';img.decoding='sync';img.style.cssText='display:block;width:100%;max-width:600px;height:auto;margin:0 auto;object-fit:contain;';var w=document.createElement('div');w.id='__lcp_fallback';w.style.cssText='position:absolute;top:0;left:0;right:0;display:flex;justify-content:center;pointer-events:none;z-index:0;';w.appendChild(img);r.appendChild(w);}catch(e){}})();</script>`;

      // /matrix instant shell: preload the default render (18 Pro, Cherry
      // Carbon, Dark Cherry) and paint a static header/image/title/price/buy
      // block before the JS bundle arrives. MatrixPage removes it on mount.
      const mUrl = JSON.stringify(matrixFirstRender.url);
      const matrixHeadScript = `<script>(function(){try{if(location.pathname.replace(/\\/$/,'')!=='/matrix')return;var l=document.createElement('link');l.rel='preload';l.as='image';l.href=window.matchMedia('(max-width:1023px)').matches?${JSON.stringify(matrixMobileRender.url)}:${mUrl};l.imageSrcset=window.matchMedia('(max-width:1023px)').matches?${JSON.stringify(matrixMobileRender.url + ' 800w')}:${JSON.stringify(matrixFirstRender.url + ' 1200w')};l.setAttribute('fetchpriority','high');document.head.appendChild(l);}catch(e){}})();</script>`;
      const logoUrl = `data:image/webp;base64,${readFileSync(path.resolve(__dirname, "src/assets/logo-new-400w.webp")).toString("base64")}`;
      const shellHtml = matrixShellHtml(matrixFirstRender.url, logoUrl, matrixMobileRender.url);
      // Parse critical CSS in the head, before any shell element can be painted.
      const shellCss = shellHtml.match(/^<style>[\s\S]*?<\/style>/)?.[0] ?? "";
      const matrixShellScript = makeMatrixShellScript(shellHtml.slice(shellCss.length));

      return html
        .replace('<meta name="viewport" content="width=device-width, initial-scale=1.0" />', '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' + shellCss)
        .replace("<!--HERO_PRELOAD-->", preloadTag + matrixHeadScript)
        .replace('<div id="root"></div>', '<div id="root"></div>' + matrixShellScript)
        .replace("</body>", fallbackScript + "</body>");
    },
  },
});



// Vite plugin: per-route static HTML for crawlers without JavaScript.
// Dev: the served index.html is rewritten for the requested route.
// Build: emits <route>/index.html and <route>.html for every snapshot route
// and rewrites index.html with the "/" snapshot.
const prerenderPlugin = (): PluginOption => {
  const snapshot = loadSnapshot(__dirname);
  return {
    name: "raj-prerender",
    enforce: "post",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        if (!ctx.server) return html;
        const snap = snapshot[normalizeRoute(ctx.originalUrl)];
        return snap ? renderRouteHtml(html, snap) : html;
      },
    },
    generateBundle(_opts, bundle) {
      const asset = bundle["index.html"];
      if (!asset || asset.type !== "asset") return;
      const base = String(asset.source);
      for (const [route, snap] of Object.entries(snapshot)) {
        const html = renderRouteHtml(base, snap);
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
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
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
