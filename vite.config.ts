import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
// @ts-expect-error - .mjs script without type declarations
import { generateSitemap } from "./scripts/generate-sitemap.mjs";
import heroWebp400 from "./src/assets/products/nexus-hero-v2-400w.webp.asset.json";
import heroWebp800 from "./src/assets/products/nexus-hero-v2-800w.webp.asset.json";
import heroWebp1200 from "./src/assets/products/nexus-hero-v2-1200w.webp.asset.json";
import matrixFirstRender from "./src/assets/matrix/optimized-renders/18-cherry-cherry-darkcherry.webp.asset.json";

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
      const preloadTag = `<link rel="preload" as="image" href="${url800}" imagesrcset="${srcset}" imagesizes="100vw" fetchpriority="high" />`;

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
      const matrixHeadScript = `<script>(function(){try{if(location.pathname.replace(/\\/$/,'')!=='/matrix')return;var l=document.createElement('link');l.rel='preload';l.as='image';l.href=${mUrl};l.setAttribute('fetchpriority','high');document.head.appendChild(l);}catch(e){}})();</script>`;
      const btn = (t: string, on: boolean) => `<span style="flex:1;text-align:center;padding:8px 2px;border-radius:8px;font-size:12px;border:1px solid ${on ? "#9b6b3f" : "rgba(43,39,37,0.22)"};background:${on ? "rgba(155,107,63,0.06)" : "transparent"}">${t}</span>`;
      const shellHtml = `<div style="height:64px;display:flex;align-items:center;justify-content:center;border-bottom:1px solid rgba(43,39,37,0.10)"><span style="font-size:22px;letter-spacing:0.3em;font-weight:500">RAJ</span></div><div style="max-width:480px;margin:0 auto;padding:12px 20px"><div style="aspect-ratio:1/1;display:flex;justify-content:center"><img src=${mUrl} alt="RAJ MATRIX Cherry Carbon Hülle für iPhone 18 Pro in Dark Cherry" width="928" height="1152" fetchpriority="high" decoding="async" style="height:100%;width:100%;max-width:286px;object-fit:contain"></div><div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:12px"><div style="font-size:19px;font-weight:300"><span style="color:#9b6b3f">MATRIX</span></div><span style="font-size:20px;font-weight:300">CHF 59.–</span></div><div style="display:flex;gap:6px;margin-top:14px">${btn("17 Pro", false)}${btn("17 Pro Max", false)}${btn("18 Pro", true)}${btn("18 Pro Max", false)}</div><div style="margin-top:16px;padding:14px;border-radius:12px;background:#2b2725;color:#faf9f7;text-align:center;font-size:14px;letter-spacing:0.08em">JETZT KAUFEN · CHF 59.–</div></div>`;
      const matrixShellScript = `<script>(function(){try{if(location.pathname.replace(/\\/$/,'')!=='/matrix')return;var d=document.createElement('div');d.id='__matrix_shell';d.setAttribute('aria-hidden','true');d.style.cssText='position:absolute;top:0;left:0;right:0;min-height:100vh;background:#faf9f7;color:#2b2725;z-index:60;font-family:-apple-system,BlinkMacSystemFont,system-ui,Helvetica,Arial,sans-serif;';d.innerHTML=${JSON.stringify(shellHtml)};var r=document.getElementById('root');r.parentNode.insertBefore(d,r.nextSibling);setTimeout(function(){d.remove()},10000);}catch(e){}})();</script>`;

      return html
        .replace("<!--HERO_PRELOAD-->", preloadTag + matrixHeadScript)
        .replace('<div id="root"></div>', '<div id="root"></div>' + matrixShellScript)
        .replace("</body>", fallbackScript + "</body>");
    },
  },
});



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
