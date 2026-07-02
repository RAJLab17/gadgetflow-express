import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
// @ts-expect-error - .mjs script without type declarations
import { generateSitemap } from "./scripts/generate-sitemap.mjs";

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
// into index.html, using the actual (hashed in production) built asset paths.
// Replaces the <!--HERO_PRELOAD--> marker in index.html.
const heroPreloadPlugin = (): PluginOption => ({
  name: "raj-hero-preload",
  apply: () => true,
  transformIndexHtml: {
    order: "post",
    handler(html, ctx) {
      const src800 = "src/assets/products/nexus-hero-charging-800w.webp";
      const src1200 = "src/assets/products/nexus-hero-charging-1200w.webp";

      let url800 = "/" + src800;
      let url1200 = "/" + src1200;

      // In production, resolve to hashed filenames from the emitted bundle.
      if (ctx.bundle) {
        for (const [fileName, chunk] of Object.entries(ctx.bundle)) {
          // @ts-expect-error - rollup asset shape
          const origName: string | string[] | undefined = chunk.originalFileName ?? chunk.originalFileNames?.[0] ?? chunk.name;
          const names = Array.isArray(origName) ? origName : [origName];
          for (const n of names) {
            if (!n) continue;
            if (n.endsWith("nexus-hero-charging-800w.webp")) url800 = "/" + fileName;
            if (n.endsWith("nexus-hero-charging-1200w.webp")) url1200 = "/" + fileName;
          }
        }
      }

      const tag = `<link rel="preload" as="image" href="${url1200}" imagesrcset="${url800} 800w, ${url1200} 1200w" imagesizes="(max-width: 768px) 100vw, 600px" fetchpriority="high" />`;
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
