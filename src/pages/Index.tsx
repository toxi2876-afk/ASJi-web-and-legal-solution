import Navbar from '../components/site/Navbar';
import HeroSection from '../components/site/HeroSection';
import AboutSection from '../components/site/AboutSection';
import ServicesSection from '../components/site/ServicesSection';
import PortfolioSection from '../components/site/PortfolioSection';
import ContactSection from '../components/site/ContactSection';
import Footer from '../components/site/Footer';

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-gold/20 selection:text-gold text-foreground">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
