import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RajRoadmap from "@/components/RajRoadmap";
import NexusShowcase from "@/components/NexusShowcase";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>RAJ — Built for what's next.</title>
        <meta
          name="description"
          content="RAJ is more than a product. A premium Swiss tech ecosystem designed to power your everyday. Discover the RAJ collection — beginning with NEXUS."
        />
      </Helmet>

      <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
        <Header />
        <main>
          <NexusShowcase />
          <RajRoadmap />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
