import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PremiumPageLayoutProps {
  title: string;
  metaDescription?: string;
  canonical?: string;
  /** Open Graph image URL (absolute). Defaults to RAJ og-image. */
  ogImage?: string;
  /** Open Graph type. Defaults to "article". */
  ogType?: string;
  eyebrow?: string;
  heading: ReactNode;
  intro?: ReactNode;
  meta?: ReactNode; // e.g. "Stand: 19.02.2026" or address block
  children: ReactNode;
  /** Width of content column. Default: prose (max-w-2xl) */
  width?: "prose" | "wide";
  /** Optional decorative background image for the hero section */
  heroImage?: string;
  /** Optional JSON-LD object(s) to inject. */
  jsonLd?: object | object[];
}

/**
 * Premium editorial page layout — used across all RAJ detail pages.
 * Light typography · generous whitespace · hairline dividers · no glow.
 */
const PremiumPageLayout = ({
  title,
  metaDescription,
  canonical,
  ogImage = "https://raj.ch/og-image.webp",
  ogType = "article",
  eyebrow,
  heading,
  intro,
  meta,
  children,
  width = "prose",
  heroImage,
  jsonLd,
}: PremiumPageLayoutProps) => {
  const maxW = width === "wide" ? "max-w-4xl" : "max-w-2xl";
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <>
      <Helmet>
        <title>{title}</title>
        {metaDescription && <meta name="description" content={metaDescription} />}
        <meta name="robots" content="index, follow" />
        {canonical && <link rel="canonical" href={canonical} />}
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        {metaDescription && <meta property="og:description" content={metaDescription} />}
        <meta property="og:type" content={ogType} />
        <meta property="og:site_name" content="RAJ" />
        {canonical && <meta property="og:url" content={canonical} />}
        <meta property="og:image" content={ogImage} />
        <meta property="og:locale" content="de_CH" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@raj_swiss_" />
        <meta name="twitter:title" content={title} />
        {metaDescription && <meta name="twitter:description" content={metaDescription} />}
        <meta name="twitter:image" content={ogImage} />
        {schemas.map((s, i) => (
          <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
        ))}
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        <main className={heroImage ? "pb-24" : "pt-24 md:pt-32 pb-24"}>
          {/* Hero */}
          {heroImage ? (
            <section className="relative w-full overflow-hidden bg-[#0a0a0a] text-white">
              <div className="absolute inset-0 pointer-events-none" aria-hidden>
                <img
                  src={heroImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center select-none"
                />
                {/* Left fade for text legibility — keeps right side (map + Thurgau) visible */}
                <div
                  className="absolute inset-0 hidden md:block"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.82) 25%, rgba(10,10,10,0.35) 50%, rgba(10,10,10,0) 75%)",
                  }}
                />
                <div
                  className="absolute inset-0 md:hidden"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.35) 50%, rgba(10,10,10,0.85) 100%)",
                  }}
                />
                {/* Bottom fade into page background */}
                <div
                  className="absolute inset-x-0 bottom-0 h-24"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 0%, hsl(var(--background)) 100%)",
                  }}
                />
              </div>

              <div className="relative px-6 md:px-12 lg:px-20 pt-32 md:pt-40 pb-32 md:pb-56 min-h-[80vh] md:min-h-[90vh] flex items-center">
                <div className={`${maxW} md:ml-[18%] lg:ml-[22%]`}>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {eyebrow && (
                      <p className="text-xs tracking-[0.32em] uppercase text-primary font-medium mb-5">
                        {eyebrow}
                      </p>
                    )}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.05] text-white">
                      {heading}
                    </h1>
                    {intro && (
                      <div className="mt-6 text-lg text-white/75 font-light leading-relaxed max-w-xl">
                        {intro}
                      </div>
                    )}
                    {meta && (
                      <div className="mt-8 text-sm text-white/60 font-light">{meta}</div>
                    )}
                  </motion.div>
                </div>
              </div>
            </section>
          ) : (
            <section className="relative px-6 overflow-hidden pt-0">
              <div className={`relative mx-auto ${maxW}`}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {eyebrow && (
                    <p className="text-xs tracking-[0.3em] uppercase text-primary font-medium mb-5">
                      {eyebrow}
                    </p>
                  )}
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-[1.1]">
                    {heading}
                  </h1>
                  {intro && (
                    <div className="mt-6 text-lg text-muted-foreground font-light leading-relaxed max-w-xl">
                      {intro}
                    </div>
                  )}
                  {meta && (
                    <div className="mt-8 text-sm text-muted-foreground font-light">
                      {meta}
                    </div>
                  )}
                </motion.div>

                <div className="mt-10 md:mt-14 h-px bg-border/60" />
              </div>
            </section>
          )}

          {/* Content */}
          <section className="px-6 mt-12 md:mt-16">
            <div className={`mx-auto ${maxW}`}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {children}
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PremiumPageLayout;
