import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LuxuryTopBar from "@/components/brand/LuxuryTopBar";
import BrandHero from "@/components/brand/BrandHero";
import BrandStory from "@/components/brand/BrandStory";
import BrandPillars from "@/components/brand/BrandPillars";
import RajRoadmap from "@/components/RajRoadmap";
import BrandJournal from "@/components/brand/BrandJournal";
import { useLanguage } from "@/contexts/LanguageContext";

const META = {
  de: {
    title: "RAJ — Power. Always there. | Schweizer Luxus-Technologie",
    desc: "RAJ ist ein Schweizer Luxus-Tech-Atelier. Premium-Objekte mit Substanz — beginnend mit NEXUS. Präzision, Beständigkeit, Charakter. Hergestellt in der Schweiz.",
  },
  fr: {
    title: "RAJ — Power. Always there. | Technologie de luxe suisse",
    desc: "RAJ est un atelier tech de luxe suisse. Objets premium de substance — à commencer par NEXUS. Précision, constance, caractère. Fabriqué en Suisse.",
  },
  it: {
    title: "RAJ — Power. Always there. | Tecnologia di lusso svizzera",
    desc: "RAJ è un atelier tech di lusso svizzero. Oggetti premium di sostanza — a partire da NEXUS. Precisione, costanza, carattere. Fatto in Svizzera.",
  },
  en: {
    title: "RAJ — Power. Always there. | Swiss Luxury Technology",
    desc: "RAJ is a Swiss luxury tech house. Premium objects of substance — beginning with NEXUS. Precision, permanence, character. Made in Switzerland.",
  },
} as const;

const Index = () => {
  const { lang } = useLanguage();
  const meta = META[lang] ?? META.de;

  return (
    <>
      <Helmet>
        <html lang={lang} />
        <title>{meta.title}</title>
        <meta name="description" content={meta.desc} />
      </Helmet>

      <div className="min-h-screen" style={{ background: "#0a0908" }}>
        <Header />
        <main>
          <BrandHero />
          <BrandStory />
          <BrandPillars />
          <RajRoadmap />
          <BrandJournal />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
