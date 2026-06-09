import { useEffect, useRef, useState } from 'react';
import { Scale, Globe, FileText, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Service } from '../../types';

const iconMap = {
  Scale,
  Globe,
  FileText,
  TrendingUp,
};

export const fallbackServices: Service[] = [
  {
    id: 1,
    title: "Legal Consulting",
    icon: "Scale",
    shortDesc: "Expert legal guidance for individuals and businesses.",
    fullDesc: "Our experienced legal consultants provide comprehensive advisory services covering corporate law, contracts, compliance, and dispute resolution. We ensure your legal interests are fully protected.",
    features: ["Corporate Law", "Contract Review", "Dispute Resolution", "Regulatory Compliance"],
    color: "#C9A84C"
  },
  {
    id: 2,
    title: "Web Development",
    icon: "Globe",
    shortDesc: "Modern, responsive websites and web applications.",
    fullDesc: "We build stunning, high-performance websites and web applications tailored to your business needs (led by Arush Sharma and Saksham Sharma). From landing pages to complex platforms, we deliver digital excellence.",
    features: ["Custom Design", "Responsive UI", "E-commerce", "CMS Integration"],
    color: "#C9A84C"
  },
  {
    id: 3,
    title: "Document Drafting",
    icon: "FileText",
    shortDesc: "Professional legal documents crafted with precision.",
    fullDesc: "Our legal experts draft, review, and finalize all types of legal documents including agreements, MOUs, NDAs, employment contracts, and corporate resolutions with meticulous attention to detail.",
    features: ["Agreements & Contracts", "MOUs & NDAs", "Employment Contracts", "Corporate Resolutions"],
    color: "#C9A84C"
  },
  {
    id: 4,
    title: "SEO & Digital Marketing",
    icon: "TrendingUp",
    shortDesc: "Grow your online presence and reach your audience.",
    fullDesc: "We help businesses dominate search rankings and expand their digital footprint. Our data-driven SEO and marketing strategies deliver measurable results and sustained growth.",
    features: ["SEO Optimization", "Content Strategy", "Social Media", "Analytics & Reporting"],
    color: "#C9A84C"
  }
];

export default function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from real database API
    fetch('/api/services')
      .then((res) => {
        if (!res.ok) {
          throw new Error('API server returned error status');
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        } else if (data && Array.isArray(data.services) && data.services.length > 0) {
          setServices(data.services);
        } else {
          setServices(fallbackServices);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('API is unavailable or returned an error, falling back to static services content:', err);
        setServices(fallbackServices);
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
      { threshold: 0.1 }
    );

    const container = containerRef.current;
    if (container && services.length > 0) {
      container.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, [services]);

  return (
    <section id="services" ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Background radial gold glow overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, hsl(42 80% 52% / 0.05) 0%, transparent 60%)',
        }}
      />

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-body text-xs uppercase tracking-widest text-gold mb-3 reveal section-hidden">
            What We Do
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light text-foreground reveal section-hidden" style={{ transitionDelay: '0.1s' }}>
            Our <span className="text-gold-gradient">Services</span>
          </h2>
          <div className="w-16 h-px bg-gold-gradient mx-auto mt-4 reveal section-hidden" style={{ transitionDelay: '0.2s' }} />
          <p className="font-body text-sm text-muted-foreground mt-6 max-w-xl mx-auto reveal section-hidden" style={{ transitionDelay: '0.25s' }}>
            Hover over each card to discover what we can do for you.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Skeleton Loading State
            [...Array(4)].map((_, i) => (
              <div key={i} className="glass-dark border border-gold/15 rounded-xl h-72 p-6 flex flex-col items-center justify-center animate-pulse">
                <div className="w-16 h-16 rounded-full bg-gold/5 mb-4" />
                <div className="w-32 h-4 bg-gold/5 rounded mb-2" />
                <div className="w-48 h-3 bg-gold/5 rounded" />
              </div>
            ))
          ) : (
            services.map((item, index) => {
              const IconComponent = iconMap[item.icon] || Scale;
              return (
                <div
                  key={item.id}
                  className="flip-card h-72 reveal section-hidden"
                  style={{ transitionDelay: `${0.1 * index}s` }}
                >
                  <div className="flip-card-inner w-full h-full">
                    {/* Card Front */}
                    <div className="flip-card-front w-full h-full glass-dark rounded-xl border border-gold/15 p-6 flex flex-col items-center justify-center text-center hover:border-gold/40 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4 shadow-gold">
                        <IconComponent size={28} className="text-gold" />
                      </div>
                      <h3 className="font-display text-xl text-foreground mb-2">{item.title}</h3>
                      <p className="font-body text-xs text-muted-foreground leading-5">{item.shortDesc}</p>
                      <div className="mt-4 text-xs text-gold/60 font-body uppercase tracking-widest">
                        Hover to learn more
                      </div>
                    </div>

                    {/* Card Back */}
                    <div
                      className="flip-card-back w-full h-full rounded-xl border border-gold/40 p-6 flex flex-col justify-between"
                      style={{
                        background: 'linear-gradient(135deg, hsl(200 18% 10%), hsl(42 80% 10%))',
                      }}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <IconComponent size={18} className="text-gold" />
                          <h3 className="font-display text-lg text-gold">{item.title}</h3>
                        </div>
                        <p className="font-body text-xs text-muted-foreground leading-5 mb-4">
                          {item.fullDesc}
                        </p>
                      </div>

                      <ul className="space-y-1.5">
                        {item.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-2 text-xs font-body text-foreground/70">
                            <CheckCircle2 size={12} className="text-gold flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
