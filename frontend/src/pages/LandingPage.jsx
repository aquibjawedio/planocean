import Footer from "@/components/shared/Footer";
import FeaturesSection from "@/components/shared/FeaturesSection";
import HeroSection from "@/components/shared/HeroSection";

const LandingPage = () => {
  return (
    <section className="min-h-screen flex flex-col">
      <HeroSection />

      <FeaturesSection />

      <Footer />
    </section>
  );
};

export default LandingPage;
