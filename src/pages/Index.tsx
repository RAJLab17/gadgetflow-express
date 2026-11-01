import { Helmet } from "react-helmet-async";
import { shareImageTags } from "@/lib/shareImages";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeHero from "@/components/home/HomeHero";
import HomeNexus from "@/components/home/HomeNexus";
import HomeTicker from "@/components/home/HomeTicker";
import HomeMatrix from "@/components/home/HomeMatrix";
import HomeSet from "@/components/home/HomeSet";
import HomeReviews from "@/components/home/HomeReviews";
import HomeStory from "@/components/home/HomeStory";
import HomeBusiness from "@/components/home/HomeBusiness";
import { useLanguage } from "@/contexts/LanguageContext";

const META = {
  de: {
    title: "RAJ — Power. Always there. | Schweizer Marke für Apple-Zubehör",
    desc: "RAJ ist eine Schweizer Marke aus Weinfelden: 3-in-1 Ladestation NEXUS mit Qi2.2 und bis zu 25 W sowie MagSafe-Hüllen MATRIX. Versand in 2–3 Werktagen, 30 Tage Rückgabe.",
  },
  fr: {
    title: "RAJ — Power. Always there. | Technologie de luxe suisse",
    desc: "RAJ est un atelier tech de luxe suisse. Objets premium de substance — à commencer par NEXUS. Précision, constance, caractère. Marque suisse.",
  },
  it: {
    title: "RAJ — Power. Always there. | Tecnologia di lusso svizzera",
    desc: "RAJ è un atelier tech di lusso svizzero. Oggetti premium di sostanza — a partire da NEXUS. Precisione, costanza, carattere. Marchio svizzero.",
  },
  en: {
    title: "RAJ — Power. Always there. | Swiss Luxury Technology",
    desc: "RAJ is a Swiss luxury tech house. Premium objects of substance — beginning with NEXUS. Precision, permanence, character. Swiss Brand.",
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
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://raj.ch/" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.desc} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="RAJ" />
        <meta property="og:url" content="https://raj.ch/" />
        {shareImageTags()}
        <meta property="og:locale" content="de_CH" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@raj_swiss_" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.desc} />
      </Helmet>

      <div className="min-h-screen" style={{ background: "#0a0908" }}>
        <Header />
        <main>
          <HomeHero />
          <HomeNexus />
          <HomeTicker />
          <HomeMatrix />
          <HomeSet />
          <HomeReviews />
          <HomeStory />
          <HomeBusiness />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
