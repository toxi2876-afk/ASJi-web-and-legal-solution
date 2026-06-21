import { useState, useEffect, useRef } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, Scale, Globe, FileText, BadgeCheck } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: "all" | "tech" | "legal";
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "What distinct capability does ASJi deliver to enterprise clients?",
    answer: "ASJi integrates a high-performance software engineering studio with expert corporate legal and audit advisory. We design elite secure Web platforms, custom compliance systems, and Technical SEO campaigns while providing expert regulatory consulting in unified execution streams.",
    category: "tech"
  },
  {
    id: 2,
    question: "How does the Consensus Document Drafting Engine reduce legal bottlenecks?",
    answer: "The Consensus engine replaces static document drafts with interactive form-wizards. By toggling active liabilities, custom indemnity caps, state jurisdictions, and party information, users compile fully-formatted NDAs, joint-venture MOUs, or SaaS service contracts in under two minutes with mock-secure electronic signatures.",
    category: "legal"
  },
  {
    id: 3,
    question: "How do your web applications and portal designs align with professional accounting practices?",
    answer: "Our advisory framework incorporates industry-leading auditing guidelines to ensure that critical tax-advisory systems, filing checklists, and corporate ledger portfolios represent elite performance metrics, SOC-2 readiness, and zero-error state-filing pipelines developed alongside certified corporate finance advisors.",
    category: "legal"
  },
  {
    id: 4,
    question: "Which technologies form the core of your architectural stack?",
    answer: "We develop exclusively inside modern React 18, Vite, Node.js routers, D3 for tailored data-indexing matrices, and local client store-state engines. Custom layouts are styled with speed-optimized tailwind constructs, backed by beautiful custom sound cues and fluid css-transition states.",
    category: "tech"
  },
  {
    id: 5,
    question: "Can we track or monitor our active contact briefs and form requests?",
    answer: "Yes. Every intake submitted via our Contact Ingress is immediately committed in-record to our server alerts stream. Admins inspect submitted profiles, selected categories, and message objectives dynamically in the encrypted administration dashboards.",
    category: "tech"
  },
  {
    id: 6,
    question: "Who oversees the delivery of technical portfolios and compliance audits?",
    answer: "Portfolios and technical campaigns are actively supervised by AJSi directors Arush Sharma and Saksham Sharma. They provide high-end coordination to guarantee that WCAG compliance, SEO volume targets, and institutional compliance standards remain absolutely flawless.",
    category: "legal"
  }
];

export default function FAQSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "tech" | "legal">("all");
  const [openId, setOpenId] = useState<number | null>(1);

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
  }, [selectedCategory]);

  const toggleFAQ = (id: number) => {
    const isOpening = openId !== id;
    setOpenId(isOpening ? id : null);

    // Play ultra-soft high frequency switch chime if opening
    if (isOpening) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
          gain.gain.setValueAtTime(0.02, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
        }
      } catch (_) {}
    }
  };

  const filteredFAQs = selectedCategory === "all" 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  return (
    <section id="faq" ref={containerRef} className="relative py-32 overflow-hidden bg-background">
      {/* Background soft gold blur accent */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 10% 80%, hsl(42 80% 52% / 0.03) 0%, transparent 50%)"
        }}
      />

      {/* Top Border Gradient Line */}
      <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="font-body text-xs uppercase tracking-widest text-gold mb-3 reveal section-hidden">
            Curated Knowledge
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light text-foreground reveal section-hidden" style={{ transitionDelay: "0.1s" }}>
            Frequently Asked <span className="text-gold-gradient font-medium italic">Inquiries</span>
          </h2>
          <p className="font-body text-sm text-muted-foreground max-w-2xl mx-auto mt-3 reveal section-hidden" style={{ transitionDelay: "0.15s" }}>
            Got queries regarding software systems, regulatory standards, or audit procedures? Learn how ASJi executes double-edged brilliance across technical and corporate boundaries.
          </p>
          
          {/* FAQ Category Filters */}
          <div className="flex items-center justify-center gap-2 mt-8 reveal section-hidden" style={{ transitionDelay: "0.2s" }}>
            <div className="inline-flex items-center bg-secondary/30 border border-gold/15 rounded-lg p-0.5">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-gold-gradient text-primary-foreground shadow-md shadow-gold/20'
                    : 'text-muted-foreground hover:text-gold'
                }`}
              >
                All FAQs
              </button>
              <button
                onClick={() => setSelectedCategory("tech")}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1 ${
                  selectedCategory === 'tech'
                    ? 'bg-gold-gradient text-primary-foreground shadow-md shadow-gold/20'
                    : 'text-muted-foreground hover:text-gold'
                }`}
              >
                <Globe size={11} />
                Software & Tech
              </button>
              <button
                onClick={() => setSelectedCategory("legal")}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1 ${
                  selectedCategory === 'legal'
                    ? 'bg-gold-gradient text-primary-foreground shadow-md shadow-gold/20'
                    : 'text-muted-foreground hover:text-gold'
                }`}
              >
                <Scale size={11} />
                Corporate & Legal
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Accordion container */}
        <div className="max-w-3xl mx-auto space-y-4 reveal section-hidden" style={{ transitionDelay: "0.25s" }}>
          {filteredFAQs.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div 
                key={item.id}
                className="glass-dark border border-gold/10 hover:border-gold/25 rounded-xl overflow-hidden transition-all duration-300 shadow-sm"
              >
                <button
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-gold/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg border border-gold/15 bg-gold/5 text-gold flex-shrink-0">
                      {item.category === 'tech' ? <Globe size={13} /> : <Scale size={13} />}
                    </span>
                    <span className="font-display text-base md:text-lg text-foreground font-semibold tracking-wide text-balance leading-snug">
                      {item.question}
                    </span>
                  </div>
                  <span className="text-gold flex-shrink-0 transition-transform duration-300">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </button>

                <div 
                  className={`accordion-wrapper ${
                    isOpen ? 'open border-t border-gold/10' : ''
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 py-5 bg-secondary/15">
                      <p className="font-body text-xs md:text-sm text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
                      <div className="flex items-center gap-1.5 mt-4 text-[10px] font-mono text-gold/70">
                        <BadgeCheck size={11} />
                        <span>Verified ASJi Policy & Advisory Outline</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Support Call-to-action anchor footer */}
        <div className="mt-16 text-center reveal section-hidden" style={{ transitionDelay: "0.3s" }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/25 border border-gold/15 rounded-full text-[11px] text-muted-foreground font-mono">
            <Sparkles size={11} className="text-gold" />
            <span>Still have a custom case scenario?</span>
            <a href="#contact" className="text-gold hover:text-gold-hover hover:underline transition-colors font-bold ml-1">
              Connect With Us Directly
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
