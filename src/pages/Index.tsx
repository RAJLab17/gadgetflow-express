import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BrandHero from "@/components/brand/BrandHero";
import BrandStory from "@/components/brand/BrandStory";
import BrandPillars from "@/components/brand/BrandPillars";
import RajRoadmap from "@/components/RajRoadmap";
import BrandJournal from "@/components/brand/BrandJournal";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>RAJ — Power. Always there.</title>
        <meta
          name="description"
          content="RAJ is a Swiss luxury tech house. Premium objects of substance — beginning with NEXUS. Precision, permanence, character. Made in Switzerland."
        />
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
