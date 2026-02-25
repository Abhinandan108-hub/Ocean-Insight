import Navbar from "@/components/floatchat/Navbar";
import Hero from "@/components/floatchat/Hero";
import Features from "@/components/floatchat/Features";
import DataPreview from "@/components/floatchat/DataPreview";
import HowItWorks from "@/components/floatchat/HowItWorks";
import AIChatSection from "@/components/floatchat/AIChatSection";
import Testimonials from "@/components/floatchat/Testimonials";
import Metrics from "@/components/floatchat/Metrics";
import CTA from "@/components/floatchat/CTA";
import Footer from "@/components/floatchat/Footer";
import SpotlightCursor from "@/components/floatchat/SpotlightCursor";

const Index = () => {
  return (
    <main className="min-h-screen">
      <SpotlightCursor />
      <Navbar />
      <Hero />
      <Features />
      <DataPreview />
      <HowItWorks />
      <AIChatSection />
      <Testimonials />
      <Metrics />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
