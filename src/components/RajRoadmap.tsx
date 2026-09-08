import { ArrowUpRight, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import matrixImage from "@/assets/home/objekt-matrix-premium.webp";
import apexImage from "@/assets/home/objekt-apex-correct.jpg";

type Milestone = {
  name: string;
  status: "available" | "next" | "early" | "locked";
  etaKey: string;
  href?: string;
  image?: string;
  imageAlt?: string;
};

const milestones: Milestone[] = [
  {
    name: "RAJ NEXUS",
    status: "available",
    etaKey: "brand.road.eta.now",
    href: "/nexus",
    image: "/assets/products/nexus-bedside-night.webp",
    imageAlt: "RAJ NEXUS 3-in-1 Wireless Charger",
  },
  {
    name: "RAJ MATRIX",
    status: "next",
    etaKey: "brand.road.eta.2026",
    href: "/matrix",
    image: matrixImage,
    imageAlt: "RAJ MATRIX Carbon-Case in Cherry Carbon",
  },
  {
    name: "RAJ APEX",
    status: "early",
    etaKey: "brand.road.eta.2027",
    href: "/apex",
    image: apexImage,
    imageAlt: "RAJ APEX MagSafe Auto-Ladehalterung",
  },
  { name: "RAJ AURORA", status: "locked", etaKey: "brand.road.eta.2026" },
  { name: "RAJ ATLAS", status: "locked", etaKey: "brand.road.eta.2027" },
  { name: "RAJ ATELIER", status: "locked", etaKey: "brand.road.eta.2027" },
  { name: "RAJ ELITE", status: "locked", etaKey: "brand.road.eta.soon" },
];

const statusLabel = (status: Milestone["status"], availableLabel: string) => {
  if (status === "available") return availableLabel;
  if (status === "next") return "Als Nächstes";
  if (status === "early") return "Early Access";
  return null;
};

const CollectionCard = ({ milestone, index }: { milestone: Milestone; index: number }) => {
  const { t } = useLanguage();
  const label = statusLabel(milestone.status, t("brand.road.unlocked"));
  const isAvailable = milestone.status === "available";
  const content = (
    <article
      className={`group relative h-[330px] min-w-[210px] overflow-hidden rounded-md border bg-card transition-all duration-500 md:min-w-0 ${
        isAvailable
          ? "border-primary/70 shadow-[0_18px_60px_-30px_hsl(var(--primary)/0.8)]"
          : "border-border hover:border-primary/50"
      }`}
    >
      {milestone.image && (
        <>
          <img
            src={milestone.image}
            alt={milestone.imageAlt ?? ""}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/10 to-background/95" />
        </>
      )}

      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="text-[10px] font-medium text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          {label ? (
            <span
              className={`inline-flex min-h-6 items-center rounded-full border px-2.5 text-[9px] font-semibold uppercase ${
                isAvailable
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-primary/55 bg-background/65 text-primary backdrop-blur-md"
              }`}
            >
              {label}
            </span>
          ) : (
            <Lock className="h-3.5 w-3.5 text-primary/75" aria-label="Noch nicht verfügbar" />
          )}
        </div>

        <div>
          <h3 className="max-w-[8ch] text-[19px] font-normal leading-[1.28] text-foreground">
            {milestone.name.replace("RAJ ", "RAJ\n").split("\n").map((line, lineIndex) => (
              <span key={line} className="block">
                {lineIndex === 0 ? line : line}
              </span>
            ))}
          </h3>
          {isAvailable && (
            <p className="mt-2 font-serif text-sm italic text-foreground/80">Hier beginnt es.</p>
          )}
          <div className="mt-7 flex items-end justify-between gap-2">
            <span className="text-[9px] font-semibold uppercase text-primary">{t(milestone.etaKey)}</span>
            {milestone.href && (
              <ArrowUpRight className="h-3.5 w-3.5 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            )}
          </div>
        </div>
      </div>
    </article>
  );

  return milestone.href ? (
    <Link to={milestone.href} aria-label={`${milestone.name} — ${t(milestone.etaKey)}`}>
      {content}
    </Link>
  ) : (
    <div aria-disabled="true">{content}</div>
  );
};

const RajRoadmap = () => {
  const { t } = useLanguage();

  return (
    <section id="ecosystem" className="dark relative overflow-hidden bg-background py-20 text-foreground scroll-mt-24 md:py-28">
      <div className="mx-auto max-w-[1500px] px-6 sm:px-10">
        <div className="mb-10 flex flex-col gap-5 border-b border-border pb-6 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase text-primary">{t("brand.road.eyebrow")}</p>
            <h2 className="max-w-2xl text-3xl font-normal leading-tight text-foreground sm:text-4xl md:text-5xl">
              {t("brand.road.headline.l1")} <span className="font-serif italic text-primary">{t("brand.road.headline.l2")}</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Von heute bis morgen. Eine Kollektion, die mit jedem Objekt weiterwächst.
          </p>
        </div>

        <div className="scrollbar-hide -mx-6 overflow-x-auto px-6 pb-4 sm:-mx-10 sm:px-10 xl:mx-0 xl:overflow-visible xl:px-0">
          <div className="grid w-max grid-cols-7 gap-4 xl:w-full">
            {milestones.map((milestone, index) => (
              <CollectionCard key={milestone.name} milestone={milestone} index={index} />
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-7 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            <span className="text-foreground">{t("brand.road.scarcity.l1")} RAJ NEXUS.</span>{" "}
            {t("brand.road.scarcity.l2")}
          </p>
          <Button asChild size="sm" className="w-fit rounded-full px-6 text-[10px] uppercase">
            <Link to="/nexus">
              {t("brand.road.cta")}
              <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RajRoadmap;