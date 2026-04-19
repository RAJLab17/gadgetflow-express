import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PremiumPageLayoutProps {
  title: string;
  metaDescription?: string;
  canonical?: string;
  eyebrow?: string;
  heading: ReactNode;
  intro?: ReactNode;
  meta?: ReactNode; // e.g. "Stand: 19.02.2026" or address block
  children: ReactNode;
  /** Width of content column. Default: prose (max-w-2xl) */
  width?: "prose" | "wide";
}

/**
 * Premium editorial page layout — used across all RAJ detail pages.
 * Light typography · generous whitespace · hairline dividers · no glow.
 */
const PremiumPageLayout = ({
  title,
  metaDescription,
  canonical,
  eyebrow,
  heading,
  intro,
  meta,
  children,
  width = "prose",
}: PremiumPageLayoutProps) => {
  const maxW = width === "wide" ? "max-w-4xl" : "max-w-2xl";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        {metaDescription && <meta name="description" content={metaDescription} />}
        {canonical && <link rel="canonical" href={canonical} />}
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        <main className="pt-24 md:pt-32 pb-24">
          {/* Hero */}
          <section className="px-6">
            <div className={`mx-auto ${maxW}`}>
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
