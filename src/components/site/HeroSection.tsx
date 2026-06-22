import ThreeHero from './ThreeHero';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();
  const scrollOffset = (selector: string) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Backgrounds */}
      <div className="absolute inset-0 bg-background">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, hsl(42 80% 52% / 0.07) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 80% 20%, hsl(42 80% 52% / 0.04) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* ThreeHero 3D Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <ThreeHero />
      </div>

      {/* Floating Sparkles particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gold/40"
          style={{
            left: `${10 + i * 8}%`,
            top: `${20 + (i % 5) * 15}%`,
            animationDelay: `${i * 0.7}s`,
            animation: `particle-drift ${6 + i * 0.5}s linear infinite`,
          }}
        />
      ))}

      {/* Centered Contents */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="flex justify-center mb-10 animate-float">
          <div className="relative p-6">
            {/* Clockwise Outer Ring representing Digital reach */}
            <div className="absolute inset-0 border border-dashed border-gold/25 rounded-full animate-spin-slow pointer-events-none" style={{ animationDuration: '40s' }} />
            
            {/* Counter-clockwise Mid Ring representing Legal protection */}
            <div className="absolute inset-2 border border-dotted border-gold/20 rounded-full animate-spin-slow pointer-events-none" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />

            {/* Glowing Backdrop Aura */}
            <div className="absolute inset-6 bg-gradient-to-r from-gold/10 via-gold/5 to-[#aa7c11]/10 rounded-full blur-xl animate-pulse-gold" />

            {/* Inner Interactive Ring container */}
            <div className="relative group/logo">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af37] via-gold-hover to-[#aa7c11] rounded-full blur opacity-60 group-hover/logo:opacity-100 transition-opacity duration-500 animate-spin-slow" style={{ animationDuration: '8s' }} />
              <img
                src="https://grazia-prod.oss-ap-southeast-1.aliyuncs.com/resources/uid_100077177/e96c9d96-e1de-48.png"
                alt="ASJi Logo"
                className="relative w-28 h-28 rounded-full object-cover shadow-gold border border-gold/40 transition-transform duration-500 group-hover/logo:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 glass-gold px-4 py-2 rounded-full mb-6 text-xs font-body uppercase tracking-widest text-gold mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse inline-block" />
          Building businesses digitally · Protecting them legally
        </div>

        <h1 className="font-display text-6xl md:text-8xl font-light mb-4 leading-none">
          <span className="text-gold-shimmer">ASJi</span>
        </h1>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-4">
          {[
            { letter: 'A', word: 'Ambition' },
            { letter: 'S', word: 'Strategy' },
            { letter: 'J', word: 'Justice' },
            { letter: 'i', word: 'Innovation' },
          ].map(({ letter, word }) => (
            <span key={letter} className="font-body text-xs text-muted-foreground tracking-wide">
              <span className="text-gold font-semibold">{letter}</span>
              {word.slice(1)}
            </span>
          ))}
        </div>

        <h2 className="font-display text-2xl md:text-4xl font-light text-foreground/80 mb-6 tracking-wide">
          Legal & Web Solutions
        </h2>

        <p className="font-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
          We help you build a powerful digital presence while keeping your business legally protected — from day one.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => scrollOffset('#services')}
            className="w-full sm:w-auto bg-gold-gradient text-primary-foreground font-body font-medium px-8 py-3.5 rounded text-sm uppercase tracking-widest hover:opacity-90 transition-all duration-300 shadow-gold animate-pulse-gold cursor-pointer text-center"
          >
            Our Services
          </button>
          <button
            onClick={() => scrollOffset('#contact')}
            className="w-full sm:w-auto glass-gold text-gold font-body font-medium px-8 py-3.5 rounded text-sm uppercase tracking-widest hover:bg-gold/15 transition-all duration-300 cursor-pointer text-center"
          >
            Get In Touch
          </button>
        </div>
      </div>

      {/* Chevron down button */}
      <button
        onClick={() => scrollOffset('#about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/50 hover:text-gold transition-colors animate-bounce cursor-pointer"
      >
        <ChevronDown size={28} />
      </button>

      {/* Bottom gradient overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, hsl(220 20% 5%))',
        }}
      />
    </section>
  );
}
