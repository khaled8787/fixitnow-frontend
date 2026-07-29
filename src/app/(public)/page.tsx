import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import TechniciansSection from "@/components/home/TechniciansSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />

      <ServicesSection />

      <TechniciansSection />

      <HowItWorksSection />

      <WhyChooseSection />
      <CTASection></CTASection>
    </main>
  );
}