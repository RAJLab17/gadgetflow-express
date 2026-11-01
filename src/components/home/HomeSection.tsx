import type { CSSProperties, ReactNode } from "react";

export type HomeSectionTone = "black" | "ivory" | "white";

const TONE_STYLES: Record<HomeSectionTone, CSSProperties> = {
  black: { backgroundColor: "var(--raj-black)", color: "var(--raj-ivory)" },
  ivory: { backgroundColor: "var(--raj-ivory)", color: "var(--raj-ink)" },
  white: { backgroundColor: "var(--raj-white)", color: "var(--raj-ink)" },
};

type HomeSectionProps = {
  tone: HomeSectionTone;
  id?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Section building block for the new homepage.
 * Mobile: 56px vertical / 20px horizontal padding.
 * From 1024px: 120px vertical / 120px horizontal padding, content max 1200px centred.
 */
const HomeSection = ({ tone, id, className, children }: HomeSectionProps) => (
  <section id={id} className={`px-5 lg:px-16${className ? ` ${className}` : ""}`} style={TONE_STYLES[tone]}>
    <div className="mx-auto w-full max-w-[1200px] py-14 lg:py-[120px]">
      {children}
    </div>
  </section>
);

export default HomeSection;
