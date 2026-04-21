import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
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
