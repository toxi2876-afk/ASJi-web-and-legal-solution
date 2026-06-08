import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { PortfolioItem } from '../../types';

const categories = ["All", "Web Development", "Document Drafting", "SEO & Marketing", "Legal Consulting"];

const initialPortfolio: PortfolioItem[] = [
  {
    id: 1,
    title: "LexaCorp Portal",
    category: "Web Development",
    description: "A full-featured corporate legal management portal with document handling and case tracking.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80"
  },
  {
    id: 2,
    title: "FirmBridge Platform",
    category: "Web Development",
    description: "Connecting legal firms with clients through an intuitive booking and consultation platform.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80"
  },
  {
    id: 3,
    title: "Contract Suite",
    category: "Document Drafting",
    description: "Comprehensive contract drafting system for a multinational trading company.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80"
  },
  {
    id: 4,
    title: "LexaSEO Campaign",
    category: "SEO & Marketing",
    description: "Boosted organic traffic by 340% for a regional law firm through targeted SEO campaigns.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"
  },
  {
    id: 5,
    title: "Nexus Legal Website",
    category: "Web Development",
    description: "Modern website with booking integration for a boutique legal consultancy.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80"
  },
  {
    id: 6,
    title: "Corporate Advisory Pack",
    category: "Legal Consulting",
    description: "End-to-end legal advisory service for a startup company from incorporation to compliance.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80"
  }
];

export default function PortfolioSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("All");

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
  }, [activeTab]);

  const filteredItems = activeTab === "All"
    ? initialPortfolio
    : initialPortfolio.filter((item) => item.category === activeTab);

  return (
    <section id="portfolio" ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Top Border Gradient Accent */}
      <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <p className="font-body text-xs uppercase tracking-widest text-gold mb-3 reveal section-hidden">
            Our Work
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light text-foreground reveal section-hidden" style={{ transitionDelay: "0.1s" }}>
            Port<span className="text-gold-gradient">folio</span>
          </h2>
          <div className="w-16 h-px bg-gold-gradient mx-auto mt-4 reveal section-hidden" style={{ transitionDelay: "0.2s" }} />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-12 reveal section-hidden" style={{ transitionDelay: "0.25s" }}>
          {categories.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-body text-xs uppercase tracking-wider px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeTab === tab
                  ? 'bg-gold-gradient text-primary-foreground shadow-gold'
                  : 'glass-dark text-muted-foreground hover:text-gold border border-gold/15 hover:border-gold/40'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl border border-gold/10 hover:border-gold/40 transition-all duration-500 reveal section-hidden"
              style={{ transitionDelay: `${0.08 * index}s` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Hover overlay description */}
              <div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 text-center">
                <span className="font-body text-xs uppercase tracking-widest text-gold mb-2">{item.category}</span>
                <h3 className="font-display text-2xl text-foreground mb-2">{item.title}</h3>
                <p className="font-body text-xs text-muted-foreground leading-5 mb-4">{item.description}</p>
                <div className="w-8 h-px bg-gold-gradient mb-4" />
                <div className="w-10 h-10 rounded-full glass-gold flex items-center justify-center text-gold">
                  <ExternalLink size={16} />
                </div>
              </div>

              {/* Default persistent description when not hovered */}
              <div className="absolute bottom-0 left-0 right-0 p-4 glass-dark group-hover:opacity-0 transition-opacity duration-300">
                <p className="font-body text-xs uppercase tracking-wider text-gold/60">{item.category}</p>
                <h3 className="font-display text-l text-foreground">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Border Gradient Accent */}
      <div className="absolute right-0 bottom-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
}
