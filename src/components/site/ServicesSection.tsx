import { useEffect, useRef, useState } from 'react';
import { 
  Scale, 
  Globe, 
  FileText, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  Briefcase, 
  Zap, 
  Award,
  Shield,
  Bot,
  LayoutGrid,
  List
} from 'lucide-react';
import { Service } from '../../types';
import { apiService } from '../../lib/api';

const iconMap: Record<string, any> = {
  Scale,
  Globe,
  FileText,
  TrendingUp,
  Sparkles,
  Briefcase,
  Zap,
  Award,
  Shield,
  Bot
};

export default function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'ledger'>('grid');

  useEffect(() => {
    apiService.getServices()
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to get services:', err);
        setLoading(false);
      });
  }, []);

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
      { threshold: 0.01 }
    );

    const container = containerRef.current;
    if (container && services.length > 0) {
      container.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, [services, selectedCategory, viewMode]);

  // Unique categories derived from services
  const categories = ['All', ...Array.from(new Set(services.map(s => s.category).filter(Boolean))) as string[]];

  // Filtered list
  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <section id="services" ref={containerRef} className="relative py-28 overflow-hidden bg-background">
      {/* Background radial gold glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, hsl(42 80% 52% / 0.04) 0%, transparent 70%)',
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <p className="font-body text-xs uppercase tracking-widest text-gold mb-3 reveal section-hidden">
            Curated Professional Solutions & Pricing
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground reveal section-hidden" style={{ transitionDelay: '0.1s' }}>
            Professional Services & <span className="text-gold-gradient font-medium">Clear Pricing</span>
          </h2>
          <div className="w-16 h-px bg-gold-gradient mx-auto mt-4 reveal section-hidden" style={{ transitionDelay: '0.2s' }} />
          <p className="font-body text-sm text-muted-foreground mt-4 max-w-xl mx-auto reveal section-hidden" style={{ transitionDelay: '0.25s' }}>
            High-transparency legal consultations, elite web architectures, and advanced AI automation. Hover on any service card to view complete features.
          </p>
        </div>

        {/* View Switcher: Interactive Cards vs Pristine Pricing Ledger */}
        <div className="flex items-center justify-center mb-8 reveal section-hidden" style={{ transitionDelay: '0.28s' }}>
          <div className="inline-flex p-1 bg-secondary/15 border border-gold/15 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-gold-gradient text-primary-foreground font-bold shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid size={14} />
              Interactive Cards
            </button>
            <button
              onClick={() => setViewMode('ledger')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                viewMode === 'ledger'
                  ? 'bg-gold-gradient text-primary-foreground font-bold shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List size={14} />
              All Prices (Rate Ledger)
            </button>
          </div>
        </div>

        {/* Category Toggles */}
        {services.length > 0 && categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12 reveal section-hidden" style={{ transitionDelay: '0.3s' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-full border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gold-gradient border-transparent text-primary-foreground font-bold shadow-xl shadow-gold/10 scale-105'
                    : 'border-gold/15 bg-secondary/10 text-muted-foreground hover:border-gold/40 hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Services Grid Layout */}
        {viewMode === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Skeleton Loading State
              [...Array(4)].map((_, i) => (
                <div key={i} className="glass-dark border border-gold/15 rounded-xl h-80 p-6 flex flex-col items-center justify-center animate-pulse">
                  <div className="w-14 h-14 rounded-full bg-gold/5 mb-4" />
                  <div className="w-32 h-4 bg-gold/5 rounded mb-2" />
                  <div className="w-48 h-3 bg-gold/5 rounded" />
                </div>
              ))
            ) : filteredServices.length === 0 ? (
              <div className="col-span-full py-16 text-center border border-dashed border-gold/10 rounded-xl bg-secondary/5">
                <Briefcase className="w-8 h-8 text-gold/30 mx-auto mb-3" />
                <p className="text-sm font-display text-muted-foreground">No services configured for this category yet.</p>
              </div>
            ) : (
              filteredServices.map((item, index) => {
                const IconComponent = iconMap[item.icon] || Scale;
                return (
                  <div
                    key={item.id}
                    className="flip-card h-80 reveal section-hidden"
                    style={{ transitionDelay: `${0.05 * index}s` }}
                  >
                    <div className="flip-card-inner w-full h-full">
                      {/* Card Front */}
                      <div className={`flip-card-front w-full h-full glass-dark rounded-xl border p-6 flex flex-col justify-between text-center transition-all ${
                        item.isPopular 
                          ? 'border-gold/40 shadow-lg shadow-gold/5 bg-gradient-to-b from-gold/[0.03] to-transparent' 
                          : 'border-gold/15 hover:border-gold/40'
                      }`}>
                        {/* Popular / Best Badge */}
                        {item.isPopular && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-[9px] font-mono text-gold uppercase font-semibold">
                            <Award size={10} className="animate-pulse" />
                            Best Value
                          </div>
                        )}

                        {/* Top section: Category & Icon */}
                        <div className="flex flex-col items-center mt-2">
                          {item.category && (
                            <span className="text-[10px] font-mono uppercase tracking-widest text-gold/60 mb-2">
                              {item.category}
                            </span>
                          )}
                          <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-3 shadow-gold group-hover:scale-110 transition-transform">
                            <IconComponent size={24} className="text-gold" />
                          </div>
                          <h3 className="font-display text-lg text-foreground font-medium tracking-tight mb-2 line-clamp-1">{item.title}</h3>
                          <p className="font-body text-xs text-muted-foreground leading-relaxed line-clamp-2 px-1">{item.shortDesc}</p>
                        </div>

                        {/* Bottom section: Price and Action */}
                        <div className="border-t border-gold/5 pt-4 mt-2">
                          <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-1">
                            Investment Point
                          </div>
                          <div className="text-base font-display text-gold font-semibold tracking-tight">
                            {item.price || "₹499"}
                          </div>
                          <div className="text-[10px] text-gold/60 font-mono uppercase tracking-widest mt-2 hover:underline cursor-pointer">
                            View Details &amp; Price &rarr;
                          </div>
                        </div>
                      </div>

                      {/* Card Back */}
                      <div
                        className="flip-card-back w-full h-full rounded-xl border border-gold/40 p-5 flex flex-col justify-between"
                        style={{
                          background: 'linear-gradient(135deg, hsl(200 18% 10%), hsl(42 80% 8%))',
                        }}
                      >
                        <div>
                          <div className="flex items-center justify-between border-b border-gold/10 pb-2.5 mb-3">
                            <div className="flex items-center gap-2">
                              <IconComponent size={16} className="text-gold" />
                              <h3 className="font-display text-sm text-gold font-medium line-clamp-1">{item.title}</h3>
                            </div>
                            <span className="font-mono text-xs text-gold font-semibold bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
                              {item.price || "₹499"}
                            </span>
                          </div>
                          <p className="font-body text-[11px] text-muted-foreground leading-relaxed mb-4">
                            {item.fullDesc}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="text-[9px] font-mono uppercase tracking-wider text-gold/60">Features Included:</div>
                          <ul className="space-y-1.5">
                            {item.features.map((feature, fIdx) => (
                              <li key={fIdx} className="flex items-center gap-2 text-xs font-body text-foreground/80">
                                <CheckCircle2 size={12} className="text-gold flex-shrink-0" />
                                <span className="truncate">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Comprehensive Dynamic Ledger */
          <div className="glass-dark border border-gold/15 rounded-2xl p-6 md:p-10 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gold/10 pb-6 mb-8 gap-4">
              <div>
                <h3 className="font-display text-2xl font-light text-foreground">
                  Official Service <span className="text-gold-gradient font-medium">Rate Ledger</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-lg font-body leading-relaxed">
                  Consolidated fee breakdown representing all direct solutions, digital builds, integrations, and branding suites. Addressed transparently for advocate groups and law practitioners.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-gold-gradient uppercase tracking-widest bg-gold/5 border border-gold/25 px-3 py-1.5 rounded">
                  {filteredServices.length} Rates Listed
                </span>
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center text-muted-foreground font-mono text-xs animate-pulse">
                Retrieving active service logs...
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-gold/10 rounded-xl bg-secondary/5">
                <Briefcase className="w-8 h-8 text-gold/30 mx-auto mb-3" />
                <p className="text-sm font-display text-muted-foreground">No rate items registered inside this category.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {Array.from(new Set(filteredServices.map(s => s.category || 'Other Services'))).map(categoryName => {
                  const categoryServices = filteredServices.filter(s => (s.category || 'Other Services') === categoryName);
                  return (
                    <div key={categoryName} className="space-y-4">
                      <h4 className="font-mono text-[10px] uppercase tracking-widest text-gold border-l-2 border-gold pl-3 mb-4 font-bold flex items-center justify-between bg-gold/5 py-1.5 pr-3 rounded-r">
                        <span>{categoryName}</span>
                        <span className="text-[9px] text-muted-foreground font-normal tracking-normal">{categoryServices.length} items</span>
                      </h4>

                      <div className="divide-y divide-gold/10 border border-gold/15 rounded-xl overflow-hidden bg-[#0d1017]/80">
                        {categoryServices.map((service) => {
                          const IconComp = iconMap[service.icon] || Scale;
                          return (
                            <div key={service.id} className="p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-gold/[0.02] transition-colors relative group">
                              <div className="flex items-start gap-4 flex-1">
                                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 border border-gold/15 group-hover:scale-105 transition-transform">
                                  <IconComp size={18} className="text-gold" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h5 className="font-display text-base text-foreground font-medium group-hover:text-gold transition-colors">{service.title}</h5>
                                    {service.isPopular && (
                                      <span className="px-2 py-0.5 bg-gold/10 text-gold text-[8px] font-mono uppercase font-black tracking-wider rounded border border-gold/30 flex items-center gap-0.5">
                                        <Award size={8} /> Popular
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed font-body">{service.shortDesc}</p>
                                  <div className="flex flex-wrap gap-2 pt-1.5">
                                    {service.features.map((feat, fidx) => (
                                      <span key={fidx} className="text-[9px] font-mono text-foreground/75 bg-secondary/20 px-2 py-0.5 rounded border border-gold/5 flex items-center gap-1">
                                        <CheckCircle2 size={8} className="text-gold" /> {feat}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="flex md:flex-col items-end md:justify-start justify-between w-full md:w-auto border-t md:border-t-0 border-gold/5 pt-4 md:pt-0 gap-2">
                                <div className="text-right flex flex-col items-end relative min-w-[80px]">
                                  <span className="text-[9px] uppercase font-mono tracking-widest text-muted-foreground mb-0.5">Starting At</span>
                                  <div className="relative">
                                    <span className="text-xl font-display text-gold font-semibold transition-all duration-300">
                                      {service.price || "₹499"}
                                    </span>
                                  </div>
                                </div>
                                <a 
                                  href="#contact"
                                  onClick={() => {
                                    const subjectEl = document.getElementById('inquirySubject') as HTMLInputElement | HTMLSelectElement;
                                    if (subjectEl) {
                                      subjectEl.value = service.title;
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-gold-gradient text-primary-foreground rounded text-[10px] font-mono uppercase font-bold tracking-wider transition-all hover:scale-105"
                                >
                                  Inquire Now
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-12 text-center p-6 bg-gold/[0.03] border border-gold/10 rounded-xl max-w-2xl mx-auto">
              <p className="text-xs text-muted-foreground italic leading-relaxed font-body">
                Need a custom tailored package? We provide discounted bundled legal portfolios + web systems for multi-member advocate law chambers and independent advocates.
              </p>
              <div className="mt-4 flex justify-center">
                <a 
                  href="#contact" 
                  onClick={() => {
                    const subjectEl = document.getElementById('inquirySubject') as HTMLInputElement | HTMLSelectElement;
                    if (subjectEl) {
                      subjectEl.value = "Custom Tailored Package";
                    }
                  }}
                  className="px-4 py-2 bg-secondary/20 hover:bg-secondary/40 border border-gold/20 text-gold rounded font-mono font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Request Customized Quote &rarr;
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Professional Pricing Disclaimer */}
        <div className="mt-12 text-center select-none opacity-80 reveal section-hidden" style={{ transitionDelay: '0.4s' }}>
          <p className="text-[11px] font-mono text-muted-foreground/80 italic tracking-wider max-w-2xl mx-auto leading-relaxed border-t border-gold/10 pt-6">
            * prices are indicative and may vary depending on project requirements. Final pricing will be confirmed after consultation.
          </p>
        </div>
      </div>
    </section>
  );
}
