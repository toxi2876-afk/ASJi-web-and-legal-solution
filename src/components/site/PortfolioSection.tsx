import { useEffect, useRef, useState } from 'react';
import { 
  X, Code, Shield, Terminal, ArrowRight, Sparkles, Check, 
  Calendar, Layers, Filter, CheckCircle2, FileText, Globe, 
  TrendingUp, BarChart2, Eye, Download, Info
} from 'lucide-react';
import { PortfolioItem } from '../../types';

const categories = ["All", "Web Development", "Document Drafting", "SEO & Marketing", "Legal Consulting"];

const initialPortfolio: PortfolioItem[] = [
  {
    id: 1,
    title: "Aegis Corporate Governance Portal",
    category: "Web Development",
    description: "An enterprise compliance command center for managing board resolutions, real-time security score audits, and paperless SOC-2 document streams.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80",
    technologies: ["React 18", "Express API Node", "Tailwind CSS", "Lucide Icons", "Local DB Engine"],
    metrics: [
      { label: "SOC-2 Readiness", value: "100%" },
      { label: "Audit Compilation Time", value: "< 5 Mins" },
      { label: "Encrypted Files Transferred", value: "120k+" }
    ],
    longDescription: "Aegis Corporate Governance Portal was engineered to replace unsecured email threads and legacy paper systems for Fortune-500 legal boards. It offers high-performance document signing vaults, instant PDF report generation for compliance filings, and an encrypted client control panel that satisfies strict institutional security metrics.",
    mockAppType: "portal"
  },
  {
    id: 2,
    title: "ASJi JurisBridge Global Marketplace",
    category: "Web Development",
    description: "High-performance consulting consulting and booking corridor connecting elite multinational business strategists with enterprise clients.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    technologies: ["Vite Core", "Express Router", "Local Storage Core", "Web Audio API", "CSS Transitions"],
    metrics: [
      { label: "Booking Match rate", value: "99.2%" },
      { label: "Consultation Hours Synced", value: "48,000" },
      { label: "Average Fee Saved", value: "$450 / Case" }
    ],
    longDescription: "JurisBridge Global is designed for swift scheduling and friction-free intake forms. Its system tracks time records, drafts instant retainer fee contracts, and automates video consultancy intake processing with responsive browser interfaces.",
    mockAppType: "marketplace"
  },
  {
    id: 3,
    title: "Consensus Automated Drafting Engine",
    category: "Document Drafting",
    description: "An interactive legal document compiler generating customized NDAs, SaaS software agreements, and MOUs from pre-vetted legal templates.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
    technologies: ["Custom Markup", "React State Synthesizer", "E-Signature Mock", "Styled Sheets Rendering"],
    metrics: [
      { label: "Draft Generation Speed", value: "< 2 Mins" },
      { label: "Pre-Vetted Bylaws Included", value: "350+" },
      { label: "Format Error Rate", value: "0%" }
    ],
    longDescription: "Consensus replaces slow Word templates with an intuitive form-wizard. Legal teams and corporate founders toggle parameters—such as liability caps, local state jurisdictions, and intellectual property assignments—and watch perfectly formatted contracts compile instantly.",
    mockAppType: "editor"
  },
  {
    id: 4,
    title: "Vanguard Legal organic growth Campaign",
    category: "SEO & Marketing",
    description: "A tailored technical SEO audit strategy optimizing law-firm client acquisition parameters, generating over 340% increase in lead generation traffic.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    technologies: ["High Speed Static Gen", "Keyword Index Matrices", "Schema Structured Snippets"],
    metrics: [
      { label: "Search Volume Gain", value: "+340%" },
      { label: "Top-3 Organic Keywords", value: "15 Words" },
      { label: "Client Retainer Conversions", value: "+54%" }
    ],
    longDescription: "Vanguard is a data-driven technical optimization audit framework designed specifically for professional legal practices. It restructures crawl budgets, repairs missing Schema metadata nodes, and integrates responsive conversion-focused layouts to translate search engine bots into active high-paying customers.",
    mockAppType: "charts"
  },
  {
    id: 5,
    title: "Aura Luxury Consulting Experience",
    category: "Web Development",
    description: "An award-winning boutique showcase experience with customized client intake workflows, fluid layout animations, and premium style presets.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    technologies: ["Tailwind Themes Engine", "Motion Core", "Retina Asset Layouts", "Local Contacts Tracker"],
    metrics: [
      { label: "Interactive Bounce Rate", value: "11%" },
      { label: "Theme Load Velocity", value: "98/100" },
      { label: "A11y Compliance", value: "100% WCAG" }
    ],
    longDescription: "Aura is a digital brand card created for premium consultants. It represents high-end design principles and focuses on fine typography pairings, customizable color systems, fluid custom-easing responsive layouts, and elegant form transitions that maximize trust.",
    mockAppType: "website"
  },
  {
    id: 6,
    title: "Apex Enterprise Advisor Framework",
    category: "Legal Consulting",
    description: "A comprehensive digital regulatory startup planner covering incorporation checklists, state guidelines, and founders core resolutions.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80",
    technologies: ["Reactive Tasks Matrix", "Venture Compliance Guides", "Interactive Tax Class Estimator"],
    metrics: [
      { label: "State Filing Success", value: "100%" },
      { label: "Average Setup Speedup", value: "14 Days" },
      { label: "Consultation Expenses Saved", value: "$1,800/Startup" }
    ],
    longDescription: "Apex provides early-stage tech founders with a structured roadmap from idea to compliance. It replaces confusing legal guidelines with bite-size milestones and dynamic estimators, offering startup advisors a clean tool checklist to ensure corporate safety.",
    mockAppType: "advisor"
  }
];

export default function PortfolioSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("All");

  // Selection state for opening interactive checkups
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [modalTab, setModalTab] = useState<'study' | 'demo'>('study');

  // Interactive Sandbox state nodes
  // 1. Aegis governance portal states
  const [bylaws, setBylaws] = useState({
    limit: true,
    indemnification: false,
    gdpr: true,
    ipOwnership: false
  });
  const [auditLog, setAuditLog] = useState<string[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);

  // 2. JurisBridge Schedule states
  const [selectedConsultant, setSelectedConsultant] = useState('Arush Sharma');
  const [bookingDate, setBookingDate] = useState('2026-06-25');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // 3. Consensus Editor states
  const [contractType, setContractType] = useState('NDA');
  const [firstParty, setFirstParty] = useState('ASJi Solutions Ltd.');
  const [secondParty, setSecondParty] = useState('Sovereign Enterprise Corp.');
  const [jurisdiction, setJurisdiction] = useState('Delhi');
  const [isSigned, setIsSigned] = useState(false);

  // 4. Vanguard SEO states
  const [selectedKeyword, setSelectedKeyword] = useState('divorce lawyer Delhi');
  const [crawlLog, setCrawlLog] = useState<string[]>([]);
  const [isCrawling, setIsCrawling] = useState(false);

  // 5. Aura custom theme styling state
  const [auraTheme, setAuraTheme] = useState<'midnight' | 'royal' | 'platinum'>('midnight');
  const [auraFeed, setAuraFeed] = useState('Excellent layout and very responsive intake.');

  // 6. Apex task items tracker state
  const [completedHurdles, setCompletedHurdles] = useState<string[]>([
    "Set up corporate business name & DNS", "Appreciate founder share vesting schedule"
  ]);
  const [fundingGoal, setFundingGoal] = useState('50000');

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

  const openPortfolioDetail = (item: PortfolioItem) => {
    setSelectedItem(item);
    setModalTab('study');
    
    // Reset temporary states on opening a sandbox
    setAuditLog([]);
    setIsAuditing(false);
    setBookingConfirmed(false);
    setIsSigned(false);
    setCrawlLog([]);
    setIsCrawling(false);
  };

  const handleAuditInPortal = () => {
    setIsAuditing(true);
    setAuditLog(["Initialising Aegis SOC-2 integrity audit...", "Reading Board Minutes... ✔", "Checking indemnification coverage clauses..."]);
    setTimeout(() => {
      setAuditLog(prev => [...prev, bylaws.indemnification ? "Verification: Board capped limits checked. [SECURE]" : "Liability Warning: No structural indemnification capped limits active! [DANGER]"]);
    }, 400);
    setTimeout(() => {
      setAuditLog(prev => [...prev, bylaws.gdpr ? "Compliance: GDPR DPA document verified. [CORRECT]" : "GDPR Scope checklist is empty! [WARNING]"]);
    }, 800);
    setTimeout(() => {
      setAuditLog(prev => [...prev, bylaws.ipOwnership ? "Intellectual Property: Full assignment active. [PASSED]" : "IP Assignment document unsigned! Checklist incomplete."]);
    }, 1200);
    setTimeout(() => {
      setAuditLog(prev => [...prev, `REPORT GENERATED. Score: ${
        (bylaws.limit ? 25 : 0) + 
        (bylaws.indemnification ? 25 : 0) + 
        (bylaws.gdpr ? 25 : 0) + 
        (bylaws.ipOwnership ? 25 : 0)
      }/100 total safety score.`]);
      setIsAuditing(false);
    }, 1600);
  };

  const handleRunSEOAudit = () => {
    setIsCrawling(true);
    setCrawlLog(["Beginning SEO Technical Spider crawls for: 'Delhi' region", "Analyzing responsive layout CSS sheets...", "Checking Schema.org rich results..."]);
    setTimeout(() => {
      setCrawlLog(prev => [...prev, "✔ Found legal consulting FAQ schema structure nodes."]);
    }, 500);
    setTimeout(() => {
      setCrawlLog(prev => [...prev, `✔ Core Web Vitals audit: LCP speed: 1.1s. Mobile compliance: 100/100.`]);
    }, 1000);
    setTimeout(() => {
      setCrawlLog(prev => [...prev, `Keyword rankings calculated: '${selectedKeyword}' is currently Rank #1.`]);
      setIsCrawling(false);
    }, 1500);
  };

  const toggleStartupHurdle = (hurdle: string) => {
    if (completedHurdles.includes(hurdle)) {
      setCompletedHurdles(completedHurdles.filter(h => h !== hurdle));
    } else {
      setCompletedHurdles([...completedHurdles, hurdle]);
    }
  };

  return (
    <section id="portfolio" ref={containerRef} className="relative py-28 overflow-hidden bg-background">
      {/* Top Border Gradient Accent */}
      <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <p className="font-body text-xs uppercase tracking-widest text-gold mb-3 reveal section-hidden">
            Our Work
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-foreground reveal section-hidden" style={{ transitionDelay: "0.1s" }}>
            The <span className="text-gold-gradient font-medium italic">Mastery Portfolio</span>
          </h1>
          <p className="font-body text-sm text-muted-foreground max-w-2xl mx-auto mt-3 reveal section-hidden" style={{ transitionDelay: "0.15s" }}>
            Explore our premium responsive solutions and corporate legal advisory suites. Click on any block to open, boot, and launch its interactive workspace demo.
          </p>
          <div className="w-16 h-px bg-gold-gradient mx-auto mt-5 reveal section-hidden" style={{ transitionDelay: "0.2s" }} />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-16 reveal section-hidden" style={{ transitionDelay: "0.25s" }}>
          {categories.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-body text-xs uppercase tracking-wider px-5 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeTab === tab
                  ? 'bg-gold-gradient text-primary-foreground font-semibold shadow-md shadow-gold/20'
                  : 'glass-dark text-muted-foreground hover:text-gold border border-gold/15 hover:border-gold/35'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openPortfolioDetail(item)}
              className="group relative overflow-hidden rounded-xl border border-gold/10 hover:border-gold/45 bg-secondary/5 hover:bg-secondary/10 transition-all duration-500 cursor-pointer p-1 shadow-lg hover:shadow-gold/5"
              style={{ transitionDelay: `${0.06 * index}s` }}
            >
              <div className="aspect-[4/3] overflow-hidden rounded-lg relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                
                {/* Visual Pill Overlay */}
                <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-black/80 border border-gold/20 text-gold rounded-full">
                  {item.category}
                </span>

                {/* Instant Launch Action Overlay */}
                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                  <span className="font-body text-[10px] uppercase tracking-widest text-gold mb-1 font-semibold">Ready to Check</span>
                  <h3 className="font-display text-xl text-foreground mb-3">{item.title}</h3>
                  <div className="px-4 py-2 bg-gold-gradient text-primary-foreground text-xs font-bold rounded-full flex items-center gap-1.5 shadow-md shadow-gold/20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <Sparkles size={12} />
                    Launch Interactive Demo
                  </div>
                </div>
              </div>

              {/* Default Persistent Panel details */}
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-mono tracking-wider uppercase text-gold/60">{item.category}</span>
                <h3 className="font-display text-lg text-foreground group-hover:text-gold transition-colors truncate font-light leading-snug">
                  {item.title}
                </h3>
                <p className="font-body text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                
                <div className="pt-3 border-t border-gold/5 flex items-center justify-between text-[11px] text-gold font-medium">
                  <span className="flex items-center gap-1.5">
                    <Info size={11} /> 
                    View Case Study
                  </span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Interactive Trial <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Border Gradient Accent */}
      <div className="absolute right-0 bottom-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Interactive Case & Live Sandbox Modal Overlay */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-md overflow-hidden">
          <div className="relative w-full max-w-5xl h-[90vh] md:h-[80vh] bg-secondary/15 border border-gold/25 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-background border-b border-gold/15 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold font-mono flex items-center gap-1.5">
                  <Sparkles size={11} className="text-gold" />
                  Product Inspection Node
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-light text-foreground">{selectedItem.title}</h2>
              </div>
              
              {/* Tabs Switcher & Close button */}
              <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto border-t sm:border-t-0 border-gold/10 pt-3 sm:pt-0">
                <div className="flex items-center bg-secondary/30 border border-gold/15 rounded-lg p-0.5">
                  <button
                    onClick={() => setModalTab('study')}
                    className={`px-4 py-2 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      modalTab === 'study'
                        ? 'bg-gold-gradient text-primary-foreground shadow'
                        : 'text-muted-foreground hover:text-gold'
                    }`}
                  >
                    Case Study
                  </button>
                  <button
                    onClick={() => {
                      setModalTab('demo');
                      // Play warm chime on entering interactive sandbox
                      try {
                        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                        if (AudioContextClass) {
                          const ctx = new AudioContextClass();
                          const osc = ctx.createOscillator();
                          const gain = ctx.createGain();
                          osc.frequency.setValueAtTime(600, ctx.currentTime);
                          gain.gain.setValueAtTime(0.05, ctx.currentTime);
                          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                          osc.connect(gain);
                          gain.connect(ctx.destination);
                          osc.start();
                          osc.stop(ctx.currentTime + 0.3);
                        }
                      } catch(_) {}
                    }}
                    className={`px-4 py-2 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                      modalTab === 'demo'
                        ? 'bg-gold-gradient text-primary-foreground shadow'
                        : 'text-gold hover:bg-gold/5'
                    }`}
                  >
                    <Terminal size={12} />
                    Live Sandbox
                  </button>
                </div>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 text-muted-foreground hover:text-gold hover:bg-secondary/20 rounded-lg transition-all border border-gold/5 cursor-pointer ml-1"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-background/50">
              {modalTab === 'study' ? (
                /* CASE STUDY TAB VIEW */
                <div className="grid md:grid-cols-5 gap-8">
                  {/* Left Column: Visuals & Metrics */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden border border-gold/15 shadow-lg">
                      <img 
                        src={selectedItem.image} 
                        alt={selectedItem.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    </div>

                    {/* Key Technical Metric Indicators */}
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase font-bold tracking-wider text-gold font-mono flex items-center gap-1.5">
                        <BarChart2 size={12} /> Realized Metrics
                      </h4>
                      <div className="grid gap-2">
                        {selectedItem.metrics?.map((m, idx) => (
                          <div key={idx} className="bg-secondary/15 border border-gold/10 rounded-lg p-3 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground font-body">{m.label}</span>
                            <span className="font-mono text-xs font-bold text-gold">{m.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Case Details & Specs */}
                  <div className="md:col-span-3 space-y-6">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-widest text-gold bg-gold/5 border border-gold/10 px-2.5 py-1 rounded">
                        {selectedItem.category}
                      </span>
                      <h3 className="text-2xl font-display font-light text-foreground pt-2">Scope of Success</h3>
                      <p className="font-body text-xs text-muted-foreground leading-relaxed pt-2">
                        {selectedItem.longDescription}
                      </p>
                    </div>

                    {/* Technology Stack Nodes */}
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase font-bold tracking-wider text-gold font-mono flex items-center gap-1.5">
                        <Code size={12} /> Implemented Stack
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.technologies?.map((tech, idx) => (
                          <span key={idx} className="bg-secondary/20 border border-gold/10 text-[11px] font-medium text-foreground px-3 py-1.5 rounded-lg font-mono">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-secondary/10 border border-gold/10 rounded-xl p-5 space-y-3 text-xs leading-relaxed font-body">
                      <div className="flex items-center gap-2 text-gold font-semibold text-xs">
                        <Info size={14} /> Client Deployment Log
                      </div>
                      <p className="text-muted-foreground">
                        This digital asset has been completely vetted by ASJi Technical Directors. To test the live functional code block, input systems, and check real-time dynamic behavior parameters, boot up the isolated live container emulator panel next.
                      </p>
                      <button
                        onClick={() => setModalTab('demo')}
                        className="w-full mt-2 bg-gold/10 hover:bg-gold/20 border border-gold/25 text-gold py-2.5 rounded font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Terminal size={11} />
                        Run Emulator Sandbox Panel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* LIVE INTERACTIVE DEMO EMULATOR VIEW */
                <div className="h-full flex flex-col">
                  <div className="mb-4 bg-secondary/35 border border-gold/15 rounded-lg p-3 text-[11px] font-mono text-gold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                      Emulator Connected: Secure Native Sandbox Container Node Active
                    </span>
                    <span className="text-muted-foreground">ID: asji-mock-em-{selectedItem.id}</span>
                  </div>

                  {/* Sandboxes Router Block */}
                  <div className="flex-1 bg-black border border-gold/15 rounded-xl p-4 md:p-6 overflow-y-auto">
                    
                    {/* PORTAL SIMULATOR */}
                    {selectedItem.mockAppType === 'portal' && (
                      <div className="space-y-6 font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-gold/20 pb-4">
                          <span className="text-gold uppercase font-bold tracking-widest flex items-center gap-1">
                            <Shield size={14} /> Aegis Secure Console
                          </span>
                          <span className="text-muted-foreground">Version 4.1-Stable</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h4 className="text-muted-foreground uppercase text-[10px] tracking-wider font-bold">Bylaw Directives Toggle</h4>
                            <div className="space-y-2">
                              <label className="flex items-center gap-3 bg-secondary/15 p-2 rounded border border-gold/5 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={bylaws.limit} 
                                  onChange={(e) => setBylaws({ ...bylaws, limit: e.target.checked })}
                                  className="accent-gold"
                                />
                                <span>Board Approval Limit Cap ($50k)</span>
                              </label>
                              <label className="flex items-center gap-3 bg-secondary/15 p-2 rounded border border-gold/5 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={bylaws.indemnification} 
                                  onChange={(e) => setBylaws({ ...bylaws, indemnification: e.target.checked })}
                                  className="accent-gold"
                                />
                                <span>Active Indemnification Covenants</span>
                              </label>
                              <label className="flex items-center gap-3 bg-secondary/15 p-2 rounded border border-gold/5 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={bylaws.gdpr} 
                                  onChange={(e) => setBylaws({ ...bylaws, gdpr: e.target.checked })}
                                  className="accent-gold"
                                />
                                <span>GDPR Regulatory Data Addendum</span>
                              </label>
                              <label className="flex items-center gap-3 bg-secondary/15 p-2 rounded border border-gold/5 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={bylaws.ipOwnership} 
                                  onChange={(e) => setBylaws({ ...bylaws, ipOwnership: e.target.checked })}
                                  className="accent-gold"
                                />
                                <span>Mandatory IP IP Assignments</span>
                              </label>
                            </div>

                            <button
                              onClick={handleAuditInPortal}
                              disabled={isAuditing}
                              className="w-full bg-gold-gradient text-primary-foreground py-2.5 rounded font-bold uppercase tracking-wider text-[10px] shadow cursor-pointer disabled:opacity-50"
                            >
                              {isAuditing ? "Verifying Vows..." : "🔍 Compile Corporate Safety Audit"}
                            </button>
                          </div>

                          {/* Terminal Output Logs */}
                          <div className="space-y-4">
                            <h4 className="text-muted-foreground uppercase text-[10px] tracking-wider font-bold">Integrity Diagnostic Logs</h4>
                            <div className="bg-secondary/10 border border-gold/15 p-4 rounded-lg h-56 overflow-y-auto space-y-2 text-[11px] leading-relaxed">
                              {auditLog.length === 0 ? (
                                <p className="text-muted-foreground italic">Logs empty. Adjust direct bylaws and click Compile Audit to test.</p>
                              ) : (
                                auditLog.map((log, i) => (
                                  <p key={i} className={
                                    log.includes("DANGER") ? "text-red-400" :
                                    log.includes("SUCCESS") || log.includes("SECURE") ? "text-green-400" :
                                    log.includes("WARNING") ? "text-amber-400" : "text-gold/80"
                                  }>
                                    &gt; {log}
                                  </p>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* MARKETPLACE SIMULATOR */}
                    {selectedItem.mockAppType === 'marketplace' && (
                      <div className="space-y-6 font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-gold/20 pb-4">
                          <span className="text-gold uppercase font-bold tracking-widest flex items-center gap-1">
                            <Layers size={14} /> JurisBridge consulting Corridor
                          </span>
                          <span className="text-muted-foreground text-[10px]">Secure TLS v1.3 Connection</span>
                        </div>

                        {bookingConfirmed ? (
                          <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-xl text-center space-y-3">
                            <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto text-xl">✓</div>
                            <h4 className="text-foreground font-semibold text-sm">Consultation Reserved Successfully</h4>
                            <p className="text-muted-foreground text-xs font-body max-w-md mx-auto leading-relaxed">
                              Your briefing session with <strong>{selectedConsultant}</strong> is locked in on <strong>{bookingDate}</strong>. Confirmation invoice and dynamic meeting links have been synchronized with your profile.
                            </p>
                            <button
                              onClick={() => setBookingConfirmed(false)}
                              className="px-4 py-2 border border-green-500/20 rounded hover:bg-green-500/10 text-green-400 text-[10px] uppercase font-bold tracking-wider cursor-pointer"
                            >
                              Reset and Schedule Another
                            </button>
                          </div>
                        ) : (
                          <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <h4 className="text-muted-foreground uppercase text-[10px] tracking-wider font-bold">1. Select Lead Architect</h4>
                              <div className="grid gap-2">
                                {[
                                  { name: "Arush Sharma", role: "Senior Web Solutions Architect" },
                                  { name: "Saksham Sharma", role: "Corporate Bylaws attorney" },
                                  { name: "Sara Vance", role: "Technical SEO Strategist" }
                                ].map((c) => (
                                  <div 
                                    key={c.name}
                                    onClick={() => setSelectedConsultant(c.name)}
                                    className={`p-3 rounded-lg border hover:border-gold/30 cursor-pointer transition-all ${
                                      selectedConsultant === c.name 
                                        ? 'bg-gold/15 border-gold/50 text-gold' 
                                        : 'bg-secondary/15 border-gold/10 text-muted-foreground'
                                    }`}
                                  >
                                    <div className="font-semibold text-foreground text-xs">{c.name}</div>
                                    <div className="text-[10px] mt-0.5">{c.role}</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-muted-foreground uppercase text-[10px] tracking-wider font-bold">2. Consult Parameters</h4>
                              <div className="space-y-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] text-muted-foreground uppercase">Target Date</label>
                                  <input 
                                    type="date" 
                                    value={bookingDate} 
                                    onChange={(e) => setBookingDate(e.target.value)}
                                    className="w-full bg-secondary/20 border border-gold/15 p-2 rounded text-foreground text-xs"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] text-muted-foreground uppercase">Retainer Tier Type</label>
                                  <div className="p-2 border border-gold/10 rounded bg-secondary/10 flex items-center justify-between text-[11px] text-muted-foreground">
                                    <span>Hourly Briefing Session</span>
                                    <span className="text-gold font-bold">$250 (Mock Escrow Checked)</span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => setBookingConfirmed(true)}
                                  className="w-full bg-gold-gradient text-primary-foreground py-2.5 rounded font-bold uppercase tracking-wider text-[10px] cursor-pointer"
                                >
                                  Reserve Consultation Room
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* CONTRACT EDITOR SIMULATOR */}
                    {selectedItem.mockAppType === 'editor' && (
                      <div className="space-y-6 font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-gold/20 pb-4">
                          <span className="text-gold uppercase font-bold tracking-widest flex items-center gap-1">
                            <FileText size={14} /> Consensus Contract Suite
                          </span>
                          <span className="text-muted-foreground text-[10px]">Autopiling Layout Mode</span>
                        </div>

                        <div className="grid md:grid-cols-5 gap-8">
                          {/* Inputs Panel */}
                          <div className="md:col-span-2 space-y-4">
                            <h4 className="text-muted-foreground uppercase text-[10px] tracking-wider font-bold">Bylaw Directive Form</h4>
                            
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <label className="text-[10px] text-muted-foreground uppercase">Contract Framework Type</label>
                                <select 
                                  value={contractType} 
                                  onChange={(e) => {
                                    setContractType(e.target.value);
                                    setIsSigned(false);
                                  }}
                                  className="w-full bg-secondary/25 border border-gold/15 p-2 rounded text-foreground text-xs"
                                >
                                  <option value="NDA">Non-Disclosure Agreement</option>
                                  <option value="SWE">Software Development Contract</option>
                                  <option value="MOU">Joint-Venture MoU</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] text-muted-foreground uppercase">First Party (Declaring)</label>
                                <input 
                                  type="text" 
                                  value={firstParty} 
                                  onChange={(e) => { setFirstParty(e.target.value); setIsSigned(false); }}
                                  className="w-full bg-secondary/25 border border-gold/15 p-2 rounded text-foreground text-xs"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] text-muted-foreground uppercase">Second Party (Counter)</label>
                                <input 
                                  type="text" 
                                  value={secondParty} 
                                  onChange={(e) => { setSecondParty(e.target.value); setIsSigned(false); }}
                                  className="w-full bg-secondary/25 border border-gold/15 p-2 rounded text-foreground text-xs"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] text-muted-foreground uppercase">Governing Jurisdiction</label>
                                <input 
                                  type="text" 
                                  value={jurisdiction} 
                                  onChange={(e) => { setJurisdiction(e.target.value); setIsSigned(false); }}
                                  className="w-full bg-secondary/25 border border-gold/15 p-2 rounded text-foreground text-xs"
                                />
                              </div>

                              <button
                                onClick={() => {
                                  setIsSigned(true);
                                  // Play soft confirmation sound
                                  try {
                                    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                                    if (AudioContextClass) {
                                      const ctx = new AudioContextClass();
                                      const osc = ctx.createOscillator();
                                      const gain = ctx.createGain();
                                      osc.frequency.setValueAtTime(880, ctx.currentTime);
                                      gain.gain.setValueAtTime(0.04, ctx.currentTime);
                                      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
                                      osc.connect(gain);
                                      gain.connect(ctx.destination);
                                      osc.start();
                                      osc.stop(ctx.currentTime + 0.5);
                                    }
                                  } catch(_) {}
                                }}
                                disabled={isSigned}
                                className="w-full mt-2 bg-gold-gradient text-primary-foreground py-2.5 rounded font-bold uppercase tracking-wider text-[10px] cursor-pointer disabled:opacity-50"
                              >
                                {isSigned ? "🔐 E-Signature Affixed" : "✍ Sign Agreement Form Setup"}
                              </button>
                            </div>
                          </div>

                          {/* Dynamic Scrollable Paper preview sheet */}
                          <div className="md:col-span-3 space-y-4">
                            <h4 className="text-muted-foreground uppercase text-[10px] tracking-wider font-bold">Dynamic Bylaw preview Sheet</h4>
                            <div className="border border-gold/15 bg-primary rounded-xl p-5 h-72 overflow-y-auto font-serif text-slate-300 text-[11px] leading-relaxed relative flex flex-col justify-between shadow-inner">
                              
                              <div className="space-y-3">
                                <div className="text-center font-bold text-xs tracking-wider border-b border-white/5 pb-2 text-gold uppercase">
                                  {contractType === 'NDA' ? 'MUTUAL NON-DISCLOSURE AGREEMENT' : contractType === 'SWE' ? 'CUSTOM WEB DEVELOPMENT SERVICES CONTRACT' : 'MEMORANDUM OF UNDERSTANDING'}
                                </div>
                                
                                {contractType === 'NDA' && (
                                  <>
                                    <p>This Mutual Non-Disclosure Agreement (the &quot;Agreement&quot;) is made and entered into as of the present day by and between <strong>{firstParty || "[First Party]"}</strong>, hereinafter referred to as the Declaring Party, and <strong>{secondParty || "[Second Party]"}</strong>, hereinafter referred to as the Receiving Party.</p>
                                    <p>WHEREAS, the parties desire to explore a business relationship under which it is necessary to disclose proprietary information regarding custom web frameworks and legal compliance guidelines.</p>
                                    <p>NOW THEREFORE, in contemplation of the mutual covenants herein set forth, the parties agree that all confidential information remains proprietary and shall not be processed outside the bounds of the <strong>{jurisdiction || "[Jurisdiction]"}</strong> state judicial framework.</p>
                                  </>
                                )}

                                {contractType === 'SWE' && (
                                  <>
                                    <p>This Software Development Agreement (the &quot;SOW&quot;) is executed by and between <strong>{firstParty || "[First Party]"}</strong> and <strong>{secondParty || "[Second Party]"}</strong>.</p>
                                    <p>WHEREAS, First Party is a certified creator of luxury digital web systems and maintains elite software engineering capabilities. Second Party desires to retain First Party to build a custom responsive system.</p>
                                    <p>IT IS AGREED that all code base repositories, styling layers, and database endpoints shall remain exclusive property of the client upon final retainer payment clear. Any legal dispute is bounded by courts located in <strong>{jurisdiction || "[Jurisdiction]"}</strong>.</p>
                                  </>
                                )}

                                {contractType === 'MOU' && (
                                  <>
                                    <p>This Memorandum of Understanding (the &quot;MoU&quot;) specifies mutual cooperation parameters between <strong>{firstParty || "[First Party]"}</strong> and <strong>{secondParty || "[Second Party]"}</strong>.</p>
                                    <p>Both entities agree to share administrative and operational support to expand client legal audit reaches. No partnership is legally binding except for obligations detailed specifically herein. All intellectual property remains separate unless authorized.</p>
                                    <p>The principal area of performance and execution shall be governed by regulations of <strong>{jurisdiction || "[Jurisdiction]"}</strong> standard legal structures.</p>
                                  </>
                                )}
                              </div>

                              <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center text-[10px] font-mono">
                                <div>
                                  <p className="border-b border-white/20 pb-1 text-slate-400 min-w-[100px]">{firstParty}</p>
                                  <p className="text-muted-foreground text-[8px] uppercase mt-1">First Party Signature</p>
                                </div>
                                <div className="text-right">
                                  <p className="border-b border-white/20 pb-1 text-slate-400 min-w-[100px]">
                                    {isSigned ? secondParty : <span className="text-amber-500/80 italic">Awaiting E-Sign</span>}
                                  </p>
                                  <p className="text-muted-foreground text-[8px] uppercase mt-1">Second Party Signature</p>
                                </div>
                              </div>

                              {isSigned && (
                                <div className="absolute top-2 right-2 bg-green-500/20 text-green-400 border border-green-500/40 font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase rotate-6">
                                  ✓ SECURE SIGNED
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SEO ANALYTICS SIMULATOR SCREEN */}
                    {selectedItem.mockAppType === 'charts' && (
                      <div className="space-y-6 font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-gold/20 pb-4">
                          <span className="text-gold uppercase font-bold tracking-widest flex items-center gap-1">
                            <TrendingUp size={14} /> Vanguard Technical SEO dashboard
                          </span>
                          <span className="text-muted-foreground text-[10px]">Crawl Rank: #1 Active</span>
                        </div>

                        <div className="grid md:grid-cols-5 gap-8">
                          {/* Inputs */}
                          <div className="md:col-span-2 space-y-4">
                            <h4 className="text-muted-foreground uppercase text-[10px] tracking-wider font-bold font-mono">Select Keyword Node</h4>
                            <div className="space-y-1.5">
                              {[
                                "divorce lawyer Delhi", 
                                "corporate lawyer near me", 
                                "best contract drafting firm",
                                "SME legal consultant online"
                              ].map((kw) => (
                                <button
                                  key={kw}
                                  onClick={() => setSelectedKeyword(kw)}
                                  className={`w-full text-left p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                                    selectedKeyword === kw 
                                      ? 'bg-gold/15 border-gold/50 text-gold' 
                                      : 'bg-secondary/15 border-gold/10 text-muted-foreground hover:border-gold/20'
                                  }`}
                                >
                                  {kw}
                                </button>
                              ))}
                            </div>
                            
                            <button
                              onClick={handleRunSEOAudit}
                              disabled={isCrawling}
                              className="w-full bg-gold-gradient text-primary-foreground py-2.5 rounded font-bold uppercase tracking-wider text-[10px] cursor-pointer disabled:opacity-50"
                            >
                              {isCrawling ? "Crawling Nodes..." : "🚀 Trigger Live Crawl Spider"}
                            </button>
                          </div>

                          {/* Analytics Mock charts visualization */}
                          <div className="md:col-span-3 space-y-4 font-mono">
                            <h4 className="text-muted-foreground uppercase text-[10px] tracking-wider font-bold">SEO Rank Metrics &amp; Spider Logs</h4>
                            
                            <div className="bg-secondary/10 border border-gold/10 rounded-xl p-4 space-y-3.5">
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="text-muted-foreground">Tracking Keyword:</span>
                                <span className="text-gold font-bold">{selectedKeyword}</span>
                              </div>
                              
                              {/* Horizontal metric charts bar */}
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                                    <span>Google Organic Rank Elevation</span>
                                    <span className="text-green-400">Position #1 [TOP]</span>
                                  </div>
                                  <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-green-400 h-full rounded-full" style={{ width: '96%' }} />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                                    <span>Monthly Lead Generation ROI</span>
                                    <span className="text-gold">+340% Boost</span>
                                  </div>
                                  <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-gold-gradient h-full rounded-full" style={{ width: '88%' }} />
                                  </div>
                                </div>
                              </div>

                              {/* Micro spider terminal */}
                              <div className="border border-gold/10 bg-black p-3 rounded h-28 overflow-y-auto text-[10px] text-zinc-400 space-y-1">
                                {crawlLog.length === 0 ? (
                                  <p className="text-muted-foreground italic">&gt; Awaiting spider crawl trigger... Click Button to run.</p>
                                ) : (
                                  crawlLog.map((log, i) => (
                                    <p key={i} className={log.includes("✔") ? "text-green-400" : "text-zinc-400"}>
                                      &gt; {log}
                                    </p>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* AURA WEBSITE STYLE SWITCHER SIMULATOR */}
                    {selectedItem.mockAppType === 'website' && (
                      <div className="space-y-6 font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-gold/20 pb-4">
                          <span className="text-gold uppercase font-bold tracking-widest flex items-center gap-1">
                            <Globe size={14} /> Aura luxury Branding Engine
                          </span>
                          <span className="text-muted-foreground text-[10px]">Responsive Viewport Simulator</span>
                        </div>

                        <div className="grid md:grid-cols-5 gap-8">
                          {/* Left inputs */}
                          <div className="md:col-span-2 space-y-4">
                            <h4 className="text-muted-foreground uppercase text-[10px] tracking-wider font-bold">1. Select Visual Theme Preset</h4>
                            
                            <div className="flex gap-2">
                              {(['midnight', 'royal', 'platinum'] as const).map((thm) => (
                                <button
                                  key={thm}
                                  onClick={() => setAuraTheme(thm)}
                                  className={`flex-1 py-2 text-[10px] uppercase font-bold tracking-wider rounded border cursor-pointer transition-all ${
                                    auraTheme === thm
                                      ? 'bg-gold/15 border-gold text-gold shadow'
                                      : 'bg-secondary/15 border-gold/10 text-muted-foreground'
                                  }`}
                                >
                                  {thm}
                                </button>
                              ))}
                            </div>

                            <div className="space-y-2 pt-2">
                              <h4 className="text-muted-foreground uppercase text-[10px]">2. Test Intake feedback form</h4>
                              <textarea 
                                value={auraFeed} 
                                onChange={(e) => setAuraFeed(e.target.value)}
                                className="w-full h-24 bg-secondary/25 border border-gold/15 p-2 rounded text-foreground text-xs font-mono"
                                placeholder="Type some message here..."
                              />
                            </div>
                          </div>

                          {/* Beautiful Interactive Intake Page Live Sandbox Box rendering */}
                          <div className="md:col-span-3 space-y-4">
                            <h4 className="text-muted-foreground uppercase text-[10px] tracking-wider font-bold">Intake Page Device Simulation</h4>
                            
                            <div className={`p-5 rounded-2xl border transition-all duration-500 relative shadow-inner overflow-hidden min-h-[220px] flex flex-col justify-between ${
                              auraTheme === 'midnight' ? 'bg-zinc-950 border-gold/20 text-slate-100' :
                              auraTheme === 'royal' ? 'bg-emerald-950 border-emerald-500/30 text-emerald-100' :
                              'bg-neutral-100 border-neutral-300 text-neutral-900'
                            }`}>
                              
                              {/* Layout header */}
                              <div className="flex justify-between items-center border-b pb-3 animate-fade-in border-current/10">
                                <span className={`font-serif text-sm tracking-widest font-bold ${
                                  auraTheme === 'midnight' ? 'text-gold' : auraTheme === 'royal' ? 'text-emerald-400' : 'text-zinc-900 font-sans'
                                }`}>AURA CO.</span>
                                <span className="text-[9px] uppercase tracking-widest opacity-60">Consulting Menu</span>
                              </div>

                              {/* Hero */}
                              <div className="py-4 space-y-2 flex-1">
                                <h5 className="font-serif text-lg leading-tight font-light">Custom Tailored Business Advices</h5>
                                <p className="text-[10px] opacity-75 font-serif italic leading-relaxed">
                                  &quot;{auraFeed || "Awaiting your intake description form input..."}&quot;
                                </p>
                              </div>

                              {/* Fluid Action Banner */}
                              <div className="flex items-center justify-between text-[9px] uppercase tracking-wider border-t pt-3 border-current/10 opacity-70">
                                <span>Intake Submission status</span>
                                <span className="flex items-center gap-1 font-bold">
                                  Simulation OK <ArrowRight size={10} />
                                </span>
                              </div>

                              {/* Luxury styled watermark */}
                              <div className="absolute top-2 right-2 opacity-10 text-[35px] font-bold font-serif pointer-events-none">A</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* APEX PLANNERS LOGS SIMULATOR */}
                    {selectedItem.mockAppType === 'advisor' && (
                      <div className="space-y-6 font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-gold/20 pb-4">
                          <span className="text-gold uppercase font-bold tracking-widest flex items-center gap-1">
                            <Code size={14} /> Apex Startup Legal Roadmap
                          </span>
                          <span className="text-muted-foreground text-[10px]">Advisor Suite 1.0</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-muted-foreground uppercase text-[10px] tracking-wider font-bold font-mono">Completed Hurdles</h4>
                              <span className="text-[11px] text-gold font-bold">{Math.round((completedHurdles.length / 5) * 100)}% Progress</span>
                            </div>

                            <div className="space-y-2">
                              {[
                                "Set up corporate business name & DNS",
                                "Appreciate founder share vesting schedule",
                                "Draft founders core incorporation bylaws",
                                "Execute IP assignment agreements",
                                "Configure primary legal bank registry"
                              ].map((hurdle) => {
                                const active = completedHurdles.includes(hurdle);
                                return (
                                  <div 
                                    key={hurdle}
                                    onClick={() => toggleStartupHurdle(hurdle)}
                                    className={`p-2 rounded border cursor-pointer flex items-center gap-3 transition-colors ${
                                      active 
                                        ? 'bg-gold/10 border-gold/30 text-gold' 
                                        : 'bg-secondary/15 border-gold/5 text-muted-foreground hover:border-gold/20'
                                    }`}
                                  >
                                    <div className="w-4 h-4 rounded border border-current flex items-center justify-center text-[9px]">
                                      {active && "✓"}
                                    </div>
                                    <span className="text-[11px] font-sans text-foreground">{hurdle}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Advisory dynamic quote tools */}
                          <div className="space-y-4">
                            <h4 className="text-muted-foreground uppercase text-[10px] tracking-wider font-bold md:pt-0">Advisory Regulatory Filing Estimator</h4>
                            
                            <div className="bg-secondary/15 border border-gold/15 p-4 rounded-xl space-y-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] text-gold uppercase">Target Funding Size (USD)</label>
                                <input 
                                  type="number" 
                                  value={fundingGoal} 
                                  onChange={(e) => setFundingGoal(e.target.value)}
                                  className="w-full bg-black border border-gold/20 p-2 rounded text-foreground text-xs font-mono"
                                  placeholder="e.g. 100000"
                                />
                              </div>

                              <div className="space-y-2 text-[11px] text-muted-foreground leading-normal font-sans">
                                <p className="font-semibold text-gold font-mono uppercase text-[10px] mb-1">State &amp; SEC Requirements Estimated:</p>
                                <ul className="space-y-1 font-mono text-[10px] list-disc list-inside">
                                  <li>Filing: Federal SEC Form D safe-harbor registration</li>
                                  <li>State: Blue Sky notification framework</li>
                                  <li>Incorporation filing fee estimate: <span className="text-foreground">${Math.min(1500, Math.max(300, Math.round(Number(fundingGoal || '0') * 0.005)))} USD</span></li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-background border-t border-gold/15 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] text-muted-foreground font-body max-w-md text-center sm:text-left">
                All portfolios shown are actual live functional mockups built to inspect client interfaces instantly.
              </span>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 border border-gold/15 rounded-lg text-xs text-muted-foreground hover:text-gold hover:border-gold/30 transition-all cursor-pointer"
                >
                  Close Inspection
                </button>
                <a
                  href="#contact"
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2 bg-gold-gradient text-primary-foreground text-xs font-bold rounded-lg shadow shadow-gold/25 transition-all text-center"
                >
                  Retain Similar System
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
