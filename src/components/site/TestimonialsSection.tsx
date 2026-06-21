import { useState, useEffect, useRef } from 'react';
import { Star, Quote, ArrowLeft, ArrowRight, Sparkles, Award, ShieldCheck, Heart } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  rating: number;
  text: string;
  tags: string[];
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "Rajesh K. Singhania",
    role: "Managing Director",
    company: "Apex Logistics Ltd.",
    rating: 5,
    text: "ASJi designed a flawless compliance portal that cut our regulatory auditing down to under 5 minutes. Outstanding tech delivery coupled with strategic clarity.",
    tags: ["Compliance Portal", "Legal Consulting"]
  },
  {
    id: 2,
    name: "Elena Rostova",
    role: "General Counsel",
    company: "Veloce Fintech Group",
    rating: 5,
    text: "The Automated Drafting Engine designed by ASJi has been a game-changer. The system compiles perfectly structured NDAs and client SaaS agreements in minutes.",
    tags: ["Document Drafting", "Automation"]
  },
  {
    id: 3,
    name: "Dr. Devendra Vyas",
    role: "Founder & CEO",
    company: "MediGrid Global",
    rating: 5,
    text: "Saksham and Arush are an elite duo. Their high-volume onboarding web application and keyword architecture boosted our portal analytics incredibly.",
    tags: ["SEO Optimization", "Corporate Counsel"]
  },
  {
    id: 4,
    name: "Ananya Iyer",
    role: "Chief of Product",
    company: "Indus Crest Ventures",
    rating: 5,
    text: "ASJi engineered our entire investor compliance system, combining secure multi-tenant data structures with elegant user flows. Meticulous and fast execution.",
    tags: ["Investor Portal", "Compliance Flows"]
  },
  {
    id: 5,
    name: "Vikramjit Singh",
    role: "Senior Partner",
    company: "Sovereign Legal Advocates",
    rating: 5,
    text: "Drafting custom corporate records was a tedious bottleneck. With ASJi's consensus engine, our attorneys execute compliant resolutions cleanly and instantly.",
    tags: ["Document Drafting", "Security Hub"]
  }
];

export default function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            entry.target.classList.remove('section-hidden');
          }
        });
      },
      { threshold: 0.1 }
    );

    const container = containerRef.current;
    if (container) {
      container.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, [viewMode]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <section id="testimonials" ref={containerRef} className="relative py-32 overflow-hidden bg-background">
      {/* Background radial gold glow alignment */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, hsl(42 80% 52% / 0.04) 0%, transparent 60%)',
        }}
      />

      {/* Top Border Accent */}
      <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="font-body text-xs uppercase tracking-widest text-gold mb-3 reveal section-hidden">
            Client Success
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light text-foreground reveal section-hidden" style={{ transitionDelay: "0.1s" }}>
            Real <span className="text-gold-gradient font-medium italic">Testimonials</span>
          </h2>
          <p className="font-body text-sm text-muted-foreground max-w-2xl mx-auto mt-3 reveal section-hidden" style={{ transitionDelay: "0.15s" }}>
            Read how global corporations, fintech founders, and boutique brands thrive with our double-edged web delivery and regulatory compliance advisory services.
          </p>
          
          {/* Switcher Controls */}
          <div className="flex items-center justify-center gap-3 mt-6 reveal section-hidden" style={{ transitionDelay: "0.2s" }}>
            <div className="inline-flex items-center bg-secondary/30 border border-gold/15 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('slider')}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  viewMode === 'slider'
                    ? 'bg-gold-gradient text-primary-foreground shadow-md shadow-gold/20'
                    : 'text-muted-foreground hover:text-gold'
                }`}
              >
                Interactive Slide
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-gold-gradient text-primary-foreground shadow-md shadow-gold/20'
                    : 'text-muted-foreground hover:text-gold'
                }`}
              >
                All Grid View
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'slider' ? (
          /* SLIDER CAROUSEL MODE */
          <div className="max-w-4xl mx-auto reveal section-hidden" style={{ transitionDelay: "0.25s" }}>
            <div className="relative glass-dark border border-gold/20 rounded-2xl p-8 md:p-12 shadow-2xl overflow-hidden card-3d">
              {/* Decorative Accent Background Glows */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-gold/5 rounded-full blur-2xl pointer-events-none" />

              {/* Big Quote Silhouette */}
              <Quote className="absolute right-8 top-8 w-24 h-24 text-gold/5 pointer-events-none rotate-180" />

              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                {/* Visual Monogram Badge & rating Column */}
                <div className="flex flex-col items-center text-center flex-shrink-0">
                  <div className="relative mb-4">
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-gold/30 to-[#aa7c11]/20 rounded-xl blur opacity-30 animate-pulse" />
                    <div className="relative w-16 h-16 rounded-xl bg-secondary/40 border border-gold/30 flex items-center justify-center font-mono text-base font-semibold text-gold shadow-lg">
                      {getInitials(testimonialsData[currentIndex].name)}
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-gold mb-2">
                    {[...Array(testimonialsData[currentIndex].rating)].map((_, i) => (
                      <Star key={i} size={11} className="fill-gold text-gold" />
                    ))}
                  </div>
                  
                  <span className="text-[9px] font-mono uppercase tracking-widest text-gold/70 px-2 py-0.5 rounded border border-gold/15 bg-gold/5">
                    Verified Partner
                  </span>
                </div>

                {/* Testimonial Core Copy Column */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <p className="font-display text-lg md:text-xl text-foreground font-light leading-relaxed italic">
                    &ldquo;{testimonialsData[currentIndex].text}&rdquo;
                  </p>

                  <div>
                    <h4 className="font-display text-base font-semibold text-foreground tracking-wide">
                      {testimonialsData[currentIndex].name}
                    </h4>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      {testimonialsData[currentIndex].role} &middot; <span className="text-gold">{testimonialsData[currentIndex].company}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                    {testimonialsData[currentIndex].tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-mono tracking-widest uppercase text-muted-foreground bg-secondary/20 border border-gold/10 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Carousel Controls Navigation */}
              <div className="mt-8 pt-6 border-t border-gold/10 flex items-center justify-between relative z-10">
                <span className="font-mono text-xs text-muted-foreground">
                  Case <span className="text-gold font-bold">0{currentIndex + 1}</span> / 0{testimonialsData.length}
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrev}
                    className="p-2.5 rounded-lg border border-gold/15 bg-[#141820]/60 text-muted-foreground hover:text-gold hover:border-gold/50 hover:bg-gold/5 transition-all duration-300 cursor-pointer"
                    title="Previous Testimonial"
                  >
                    <ArrowLeft size={14} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2.5 rounded-lg border border-gold/15 bg-[#141820]/60 text-muted-foreground hover:text-gold hover:border-gold/50 hover:bg-gold/5 transition-all duration-300 cursor-pointer"
                    title="Next Testimonial"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* BENTO ALL GRID DISPLAY */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 reveal section-hidden" style={{ transitionDelay: "0.25s" }}>
            {testimonialsData.map((item, index) => (
              <div
                key={item.id}
                className="glass-dark border border-gold/10 hover:border-gold/30 rounded-xl p-6 shadow-md hover:shadow-gold/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group card-3d"
                style={{ transitionDelay: `${0.05 * index}s` }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gold">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} size={11} className="fill-gold text-gold" />
                      ))}
                    </div>
                    <Quote size={18} className="text-gold/10 group-hover:text-gold/25 transition-colors" />
                  </div>

                  <p className="font-body text-xs text-muted-foreground leading-relaxed italic">
                    &ldquo;{item.text}&rdquo;
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-gold/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-secondary/30 border border-gold/20 flex items-center justify-center font-mono text-[10px] font-semibold text-gold flex-shrink-0">
                    {getInitials(item.name)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display text-xs font-semibold text-foreground truncate">{item.name}</h4>
                    <p className="font-body text-[10px] text-muted-foreground truncate">
                      {item.role} &middot; <span className="text-gold/85">{item.company}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Credentials / trust markers row */}
        <div className="mt-20 border-t border-gold/10 pt-10 text-center reveal section-hidden" style={{ transitionDelay: "0.3s" }}>
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60 mb-6">Recognized Institutional trust clearances</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="font-display text-sm tracking-widest text-foreground font-semibold flex items-center gap-1">
              <Award size={14} className="text-gold" /> CHASE INC.
            </span>
            <span className="font-display text-sm tracking-widest text-foreground font-semibold flex items-center gap-1">
              <ShieldCheck size={14} className="text-gold" /> ACME DEFENSE
            </span>
            <span className="font-display text-sm tracking-widest text-foreground font-semibold flex items-center gap-1">
              <Heart size={14} className="text-gold" /> HEALTHGRID
            </span>
            <span className="font-display text-sm tracking-widest text-foreground font-semibold flex items-center gap-1">
              SOVEREIGN GRP
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
