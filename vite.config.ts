import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
// @ts-expect-error - .mjs script without type declarations
import { generateSitemap } from "./scripts/generate-sitemap.mjs";
import heroWebp800 from "./src/assets/products/nexus-hero-chatgpt-800w.webp.asset.json";
import heroWebp1200 from "./src/assets/products/nexus-hero-chatgpt-1200w.webp.asset.json";

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
      const url800 = heroWebp800.url;
      const url1200 = heroWebp1200.url;

      const tag = [
        `<link rel="preload" as="image" href="${url800}" media="(max-width: 767px)" fetchpriority="high" />`,
        `<link rel="preload" as="image" href="${url1200}" media="(min-width: 768px)" fetchpriority="high" />`,
      ].join("\n    ");
      return html.replace("<!--HERO_PRELOAD-->", tag);
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
