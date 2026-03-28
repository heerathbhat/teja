import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import VideoShowcase from "@/components/VideoShowcase";
import WorkflowSection from "@/components/WorkflowSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <ServicesSection />
    <VideoShowcase />
    <WorkflowSection />
    <ContactSection />
    <Footer />
  </div>
);

export default Index;
