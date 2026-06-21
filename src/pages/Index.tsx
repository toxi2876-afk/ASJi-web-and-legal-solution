import Navbar from '../components/site/Navbar';
import HeroSection from '../components/site/HeroSection';
import AboutSection from '../components/site/AboutSection';
import ServicesSection from '../components/site/ServicesSection';
import PortfolioSection from '../components/site/PortfolioSection';
import TestimonialsSection from '../components/site/TestimonialsSection';
import FAQSection from '../components/site/FAQSection';
import ContactSection from '../components/site/ContactSection';
import Footer from '../components/site/Footer';
import AIHub from '../components/site/AIHub';
import ReadingProgressBar from '../components/site/ReadingProgressBar';

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-gold/20 selection:text-gold text-foreground font-sans">
      <ReadingProgressBar />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
      <AIHub />
    </div>
  );
}
