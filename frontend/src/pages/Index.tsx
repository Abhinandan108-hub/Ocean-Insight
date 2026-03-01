import Navbar from "@/components/floatchat/Navbar";
import Hero from "@/components/floatchat/Hero";
import Features from "@/components/floatchat/Features";
import DataPreview from "@/components/floatchat/DataPreview";
import ComparisonSlider from "@/components/floatchat/ComparisonSlider";
import HowItWorks from "@/components/floatchat/HowItWorks";
import BGCArgoSection from "@/components/floatchat/BGCArgoSection";
import AIChatSection from "@/components/floatchat/AIChatSection";
import Testimonials from "@/components/floatchat/Testimonials";
import Metrics from "@/components/floatchat/Metrics";
import CTA from "@/components/floatchat/CTA";
import Footer from "@/components/floatchat/Footer";
import SpotlightCursor from "@/components/floatchat/SpotlightCursor";
import StickyQuickAccess from "@/components/floatchat/StickyQuickAccess";
import ScrollProgress from "@/components/floatchat/ScrollProgress";

const Index = () => {
  return (
    <main className="min-h-screen">
      <ScrollProgress />
      <SpotlightCursor />
      <StickyQuickAccess />
      <Navbar />
      <Hero />
      <Features />
      <DataPreview />
      <ComparisonSlider />
      <HowItWorks />
      <section id="bgc-argo">
        <BGCArgoSection />
      </section>
      <AIChatSection />
      <Testimonials />
      <Metrics />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
