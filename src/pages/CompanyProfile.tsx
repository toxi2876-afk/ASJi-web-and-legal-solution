import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Globe, 
  FileText, 
  Sparkles, 
  Bot, 
  TrendingUp, 
  CheckCircle2, 
  Award, 
  Shield, 
  Zap, 
  Briefcase, 
  ArrowLeft, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  User, 
  Linkedin, 
  Instagram, 
  Users, 
  BookOpen, 
  ExternalLink,
  Layers,
  Heart,
  Workflow,
  Eye,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Slide {
  id: number;
  title: string;
  category: string;
  bgGradient: string;
}

export default function CompanyProfile() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<'deck' | 'scroll'>('deck');
  const [copiedLink, setCopiedLink] = useState(false);

  // Keyboard navigation for deck mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'deck') return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        setCurrentSlide(prev => (prev < 9 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide(prev => (prev > 0 ? prev - 1 : 9));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyProfileLink = () => {
    navigator.clipboard.writeText('asji.online/profile');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const slidesData = [
    // PAGE 1: COVER
    {
      id: 1,
      title: "ASJi Web & Legal Solutions",
      subtitle: "Legal + Digital. One team. One platform.",
      category: "Master Intro",
    },
    // PAGE 2: ABOUT US
    {
      id: 2,
      title: "About Us",
      subtitle: "Bridging accuracy, expertise, and online presence.",
      category: "Overview",
    },
    // PAGE 3: LEGAL SERVICES
    {
      id: 3,
      title: "Legal Services",
      subtitle: "Precise, research-backed legal support.",
      category: "Services",
    },
    // PAGE 4: WEB & DIGITAL SERVICES
    {
      id: 4,
      title: "Web & Digital Services",
      subtitle: "Visually polished, highly optimized web builds.",
      category: "Services",
    },
    // PAGE 5: CONTENT & DOCUMENTATION
    {
      id: 5,
      title: "Content & Documentation Services",
      subtitle: "Clear, structured content for professional stand-out.",
      category: "Services",
    },
    // PAGE 6: AI & AUTOMATION SERVICES
    {
      id: 6,
      title: "AI & Automation Services",
      subtitle: "Intelligent digital flows to reduce friction.",
      category: "Innovation",
    },
    // PAGE 7: WHY CHOOSE ASJi
    {
      id: 7,
      title: "Why Choose ASJi",
      subtitle: "Our structural competitive advantages.",
      category: "Value Proposition",
    },
    // PAGE 8: INDUSTRIES WE SERVE
    {
      id: 8,
      title: "Industries We Serve",
      subtitle: "Sectors built with our comprehensive suites.",
      category: "Reach",
    },
    // PAGE 9: WORKING PROCESS
    {
      id: 9,
      title: "Our Working Process",
      subtitle: "A structured, client-centered roadmap.",
      category: "Execution",
    },
    // PAGE 10: FOUNDER & VALUES
    {
      id: 10,
      title: "Our Values & Founder",
      subtitle: "Led by Arush Sharma — Professionalism and integrity at core.",
      category: "Leadership & Contact",
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090c] text-[#f3f4f6] relative font-body selection:bg-pink-500/20 selection:text-pink-300 print:bg-white print:text-black overflow-x-hidden">
      {/* Decorative vector background */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_40%,_rgba(7,9,12,0.95)] pointer-events-none z-10" />
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-pink-500/[0.02] via-gold/[0.01] to-transparent pointer-events-none z-0" />
      
      {/* Absolute Header */}
      <header className="relative z-50 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-gold/10 print:hidden">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-full border border-gold/20 bg-secondary/80 flex items-center justify-center font-display text-lg text-gold font-bold">
            AS
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-wider text-foreground">ASJi</h1>
            <p className="text-[9px] font-mono uppercase tracking-widest text-gold/60">Web & Legal Solutions</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => navigate('/')}
            className="text-xs font-mono uppercase tracking-widert text-muted-foreground hover:text-gold px-3 py-1.5 transition-colors cursor-pointer"
          >
            &larr; Back to App
          </button>
          
          <div className="h-4 w-px bg-gold/15" />

          {/* Mode Switcher */}
          <div className="inline-flex p-1 bg-secondary/40 border border-gold/15 rounded-lg select-none">
            <button
              onClick={() => setViewMode('deck')}
              className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded transition-all cursor-pointer ${
                viewMode === 'deck'
                  ? 'bg-gold-gradient text-primary-foreground font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Interactive Deck
            </button>
            <button
              onClick={() => setViewMode('scroll')}
              className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded transition-all cursor-pointer ${
                viewMode === 'scroll'
                  ? 'bg-gold-gradient text-primary-foreground font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Full Profile Booklet
            </button>
          </div>

          <div className="h-4 w-px bg-gold/15" />

          {/* Actions */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-secondary/80 hover:bg-secondary border border-gold/20 px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-widest text-gold transition-all hover:border-gold cursor-pointer"
            title="Download/Print PDF Profile"
          >
            <Printer size={13} />
            <span>PDF Print</span>
          </button>

          <button
            onClick={handleCopyProfileLink}
            className="hidden sm:flex items-center gap-1.5 bg-pink-600/10 hover:bg-pink-600/20 border border-pink-500/20 px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-widest text-pink-400 transition-all cursor-pointer"
          >
            {copiedLink ? 'Copied URL!' : 'Share Profile'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-20 max-w-7xl mx-auto px-4 py-8 md:py-16">
        
        {/* VIEW 1: PRESENTATION DECK MODE */}
        {viewMode === 'deck' && (
          <div className="print:hidden">
            {/* Quick Navigation Slider Hub */}
            <div className="flex justify-center mb-8 gap-1 flex-wrap max-w-3xl mx-auto">
              {slidesData.map((slide, sIdx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(sIdx)}
                  className={`w-8 h-8 rounded-full font-mono text-[11px] border transition-all cursor-pointer flex items-center justify-center ${
                    currentSlide === sIdx
                      ? 'bg-gold-gradient text-primary-foreground font-black border-gold'
                      : 'bg-secondary/40 border-gold/10 text-muted-foreground hover:text-foreground hover:border-gold/30'
                  }`}
                  title={slide.title}
                >
                  {sIdx + 1}
                </button>
              ))}
            </div>

            {/* Slide Wrapper with beautiful animations */}
            <div className="min-h-[580px] w-full max-w-5xl mx-auto glass-dark rounded-3xl border border-gold/20 p-8 md:p-14 relative flex flex-col justify-between overflow-hidden shadow-2xl shadow-gold/5 bg-radial-gradient">
              {/* Outer pink/amber ring */}
              <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-pink-500/5 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-45 -left-45 w-96 h-96 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

              {/* Dynamic Logo Crest Background watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.025] pointer-events-none selection:hidden">
                <div className="w-96 h-96 rounded-full border-[8px] border-gold flex items-center justify-center font-display text-[150px] font-bold text-gold">
                  AS
                </div>
              </div>

              {/* Slide Meta Info Header */}
              <div className="flex items-center justify-between border-b border-gold/10 pb-4 mb-6 z-10">
                <span className="text-xs font-mono uppercase tracking-widest text-gold font-bold">
                  {slidesData[currentSlide].category}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  PAGE {currentSlide + 1} OF 10
                </span>
              </div>

              {/* SLIDE CARD SECTORS */}
              <div className="flex-1 flex flex-col justify-center py-4 z-10">
                
                {/* 1. COVER SLIDE */}
                {currentSlide === 0 && (
                  <div className="text-center space-y-8 animate-reveal">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-[10px] font-mono text-pink-400 uppercase tracking-widest font-black">
                      FOUNDED BY ARUSH SHARMA
                    </div>
                    <div className="space-y-4">
                      <h2 className="font-display text-5xl md:text-7xl font-semibold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-gold to-pink-300">
                        ASJi Web &amp; Legal Solutions
                      </h2>
                      <p className="font-display text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto italic">
                        &ldquo;Legal + Digital. One team. One platform.&rdquo;
                      </p>
                    </div>
                    <div className="w-16 h-0.5 bg-pink-500/40 mx-auto" />
                    <p className="text-sm font-sans text-muted-foreground max-w-xl mx-auto leading-relaxed">
                      A premium tech-legal services firm that equips advocates, organizations, and startups with authoritative contract advisory, law research, custom web portfolios, and AI automation.
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-6 flex-wrap">
                      <button 
                        onClick={() => navigate('/')} 
                        className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-mono uppercase tracking-widest font-bold transition-all shadow-lg hover:shadow-pink-500/10 cursor-pointer flex items-center gap-2"
                      >
                        Visit Main Portal
                        <ExternalLink size={12} />
                      </button>
                      <a 
                        href="https://linkedin.com" 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-6 py-3 bg-secondary border border-gold/20 hover:border-gold/40 text-muted-foreground hover:text-gold rounded-xl text-xs font-mono uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Linkedin size={14} />
                        LinkedIn
                      </a>
                      <a 
                        href="https://instagram.com" 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-6 py-3 bg-secondary border border-gold/20 hover:border-gold/40 text-muted-foreground hover:text-gold rounded-xl text-xs font-mono uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Instagram size={14} />
                        Instagram
                      </a>
                    </div>
                  </div>
                )}

                {/* 2. ABOUT US SLIDE */}
                {currentSlide === 1 && (
                  <div className="space-y-6 animate-reveal">
                    <div className="text-center md:text-left">
                      <h3 className="font-display text-4xl text-pink-400 font-bold mb-3">About ASJi</h3>
                      <p className="text-sm text-foreground/90 font-body leading-relaxed max-w-4xl">
                        ASJi Web &amp; Legal Solutions is a legal-tech and digital services firm that helps law firms, startups, businesses, and professionals get trusted legal support and a strong online presence in one place. We combine legal expertise, web development, SEO, content, and automation to deliver precise, confidential, and timely solutions that save you time and support growth.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-5 pt-4">
                      <div className="p-5 rounded-2xl bg-secondary/35 border border-gold/10 hover:border-gold/20 transition-all">
                        <div className="w-9 h-9 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 mb-3.5">
                          <Award size={18} />
                        </div>
                        <h4 className="font-display text-lg text-gold font-medium mb-1.5">Our Mission</h4>
                        <p className="text-xs text-muted-foreground font-body leading-relaxed">
                          To simplify legal and digital services by delivering high-quality work with professionalism, accuracy, confidentiality, and timely execution for every client we serve.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-secondary/35 border border-gold/10 hover:border-gold/20 transition-all">
                        <div className="w-9 h-9 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 mb-3.5">
                          <Eye size={18} />
                        </div>
                        <h4 className="font-display text-lg text-gold font-medium mb-1.5">Our Vision</h4>
                        <p className="text-xs text-muted-foreground font-body leading-relaxed">
                          To build ASJi into a trusted legal-tech brand providing comprehensive legal, web, and digital solutions under one platform while maintaining highest industry standard benchmarks.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-secondary/35 border border-gold/10 hover:border-gold/20 transition-all">
                        <div className="w-9 h-9 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 mb-3.5">
                          <Heart size={18} />
                        </div>
                        <h4 className="font-display text-lg text-gold font-medium mb-1.5">Our Promise</h4>
                        <p className="text-xs text-muted-foreground font-body leading-relaxed">
                          Every project is handled with complete confidentiality, research-backed accuracy, and a client-first mindset. We do not just deliver simple work — we deliver peace of mind.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. LEGAL SERVICES SLIDE */}
                {currentSlide === 2 && (
                  <div className="space-y-6 animate-reveal">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center">
                        <Scale size={24} className="text-gold" />
                      </div>
                      <div>
                        <h3 className="font-display text-3xl font-bold text-pink-400">Legal Services</h3>
                        <p className="text-xs text-muted-foreground">Tailored, court-ready outputs and deep precedent mapping</p>
                      </div>
                    </div>

                    <p className="text-sm font-body text-foreground/80 leading-relaxed">
                      ASJi provides precise, research-backed legal support for law firms, advocates, businesses, and individuals. We focus on contract review, legal documentation, and legal research to deliver court-ready work that is accurate, polished, and action-oriented.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4 pt-3">
                      <div className="p-4 bg-secondary/20 border border-gold/5 rounded-xl space-y-2">
                        <h4 className="text-sm font-mono text-gold font-bold uppercase">&bull; Contract Review</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Meticulous review to identify operational risks, structural liabilities, contractual loopholes, and improvement recommendations.
                        </p>
                      </div>
                      <div className="p-4 bg-secondary/20 border border-gold/5 rounded-xl space-y-2">
                        <h4 className="text-sm font-mono text-gold font-bold uppercase">&bull; Document Drafting</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Professional notices, MOUs, employee NDAs, custom tenant/commercial agreements, and specialized litigation petitions.
                        </p>
                      </div>
                      <div className="p-4 bg-secondary/20 border border-gold/5 rounded-xl space-y-2">
                        <h4 className="text-sm font-mono text-gold font-bold uppercase">&bull; Case Precedents &amp; Citation</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Exemplary case-history drafting, authority notes, and rigorous Bluebook/Supreme Court citation filings for active disputes.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. WEB & DIGITAL SERVICES SLIDE */}
                {currentSlide === 3 && (
                  <div className="space-y-6 animate-reveal">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center">
                        <Globe size={24} className="text-gold" />
                      </div>
                      <div>
                        <h3 className="font-display text-3xl font-bold text-pink-400">Web &amp; Digital Services</h3>
                        <p className="text-xs text-muted-foreground">High contrast layouts and pixel-perfect independent brand building</p>
                      </div>
                    </div>

                    <p className="text-sm font-body text-foreground/80 leading-relaxed">
                      ASJi helps law firms, businesses, and professionals build a stronger online presence with websites that are visually polished, outstandingly responsive, and built to perform dynamically.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3">
                      <div className="p-4 rounded-xl bg-secondary/15 border border-gold/10 text-center">
                        <h4 className="text-xs font-mono text-gold uppercase font-bold mb-1">Advocate Portfolios</h4>
                        <p className="text-[10px] text-muted-foreground">Perfect profile showcases for independent lawyers and practitioners.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/15 border border-gold/10 text-center">
                        <h4 className="text-xs font-mono text-gold uppercase font-bold mb-1">Law Firm Webs</h4>
                        <p className="text-[10px] text-muted-foreground">Elite corporate design to structure firm directories and expertise.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/15 border border-gold/10 text-center">
                        <h4 className="text-xs font-mono text-gold uppercase font-bold mb-1">Technical SEO</h4>
                        <p className="text-[10px] text-muted-foreground">Local map pack boosts and rich search performance enhancements.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/15 border border-gold/10 text-center">
                        <h4 className="text-xs font-mono text-gold uppercase font-bold mb-1">Reliable Support</h4>
                        <p className="text-[10px] text-muted-foreground">Ongoing layout repairs, backup schedules, and copy edits.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. CONTENT & DOCUMENTATION SLIDE */}
                {currentSlide === 4 && (
                  <div className="space-y-6 animate-reveal">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center">
                        <FileText size={24} className="text-gold" />
                      </div>
                      <div>
                        <h3 className="font-display text-3xl font-bold text-pink-400">Content &amp; Doc Services</h3>
                        <p className="text-xs text-muted-foreground">Transforming drafts into beautiful, high-converting professional channels</p>
                      </div>
                    </div>

                    <p className="text-sm font-body text-foreground/80 leading-relaxed">
                      ASJi creates clear, polished content and professional documentation that helps you present your best self — quickly and effectively. We focus on resume writing, legal content, and business-ready documentation tailored to your goals and audience.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4 pt-2">
                      <div className="p-4 bg-[#0d1017] border border-gold/10 rounded-xl space-y-1.5">
                        <span className="text-[10px] font-mono text-pink-400 uppercase font-black">CAREER PACKS</span>
                        <h4 className="font-display text-base text-foreground font-medium">Resume &amp; CV Design</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Resumes, cover letters, and premium LinkedIn bio setups designed to establish absolute command.
                        </p>
                      </div>

                      <div className="p-4 bg-[#0d1017] border border-gold/10 rounded-xl space-y-1.5">
                        <span className="text-[10px] font-mono text-pink-400 uppercase font-black">COPYWRITING</span>
                        <h4 className="font-display text-base text-foreground font-medium">Legal Content &amp; Media</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Custom journals, active content briefs, legal advisory articles, and client newsletters.
                        </p>
                      </div>

                      <div className="p-4 bg-[#0d1017] border border-gold/10 rounded-xl space-y-1.5">
                        <span className="text-[10px] font-mono text-pink-400 uppercase font-black">STRUCTURE</span>
                        <h4 className="font-display text-base text-foreground font-medium">Professional Files</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Clean reports, formal proposals, slide decks, and digital spreadsheets styled to extreme specifications.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. AI & AUTOMATION SLIDE */}
                {currentSlide === 5 && (
                  <div className="space-y-6 animate-reveal">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center">
                        <Bot size={24} className="text-gold" />
                      </div>
                      <div>
                        <h3 className="font-display text-3xl font-bold text-pink-400">AI &amp; Automation Services</h3>
                        <p className="text-xs text-muted-foreground">Cutting-edge automations designed to eliminate manual administration</p>
                      </div>
                    </div>

                    <p className="text-sm font-body text-foreground/80 leading-relaxed">
                      ASJi helps businesses, law firms, and professionals streamline workflows with intelligent automation and AI-powered tools. We identify high-impact opportunities, reduce manual effort, and deliver faster, more efficient operations.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded-xl bg-secondary/30 border border-gold/10 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0 text-pink-400 font-mono text-xs font-black">01</div>
                        <div>
                          <h4 className="text-sm font-display text-gold font-medium mb-0.5">Workflow Automations</h4>
                          <p className="text-xs text-muted-foreground">Automatic lead logs, dynamic template text triggers, and scheduling notifications.</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-secondary/30 border border-gold/10 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0 text-pink-400 font-mono text-xs font-black">02</div>
                        <div>
                          <h4 className="text-sm font-display text-gold font-medium mb-0.5">AI Chatbot Integrations</h4>
                          <p className="text-xs text-muted-foreground">24/7 qualifying chat nodes that log incoming client queries directly to your desk.</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-secondary/30 border border-gold/10 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0 text-pink-400 font-mono text-xs font-black">03</div>
                        <div>
                          <h4 className="text-sm font-display text-gold font-medium mb-0.5">Automated Document Engines</h4>
                          <p className="text-xs text-muted-foreground">Input specifications into a structured portal and retrieve standard agreements in minutes.</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-secondary/30 border border-gold/10 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0 text-pink-400 font-mono text-xs font-black">04</div>
                        <div>
                          <h4 className="text-sm font-display text-gold font-medium mb-0.5">Productivity Systems</h4>
                          <p className="text-xs text-muted-foreground">Auto-sync calendar events, official WhatsApp notifications, and lead forms.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. WHY CHOOSE ASJi SLIDE */}
                {currentSlide === 6 && (
                  <div className="space-y-6 animate-reveal">
                    <div className="text-center">
                      <h3 className="font-display text-3xl font-bold text-pink-400 mb-2">Why Choose ASJi</h3>
                      <p className="text-xs text-muted-foreground max-w-xl mx-auto font-body">
                        The ultimate synergy of technical engineering precision and comprehensive litigation analysis.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 pt-4">
                      <div className="p-4 rounded-xl bg-secondary/30 border border-gold/10 text-center flex flex-col justify-between h-44">
                        <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 mx-auto text-sm font-black font-mono">1</div>
                        <div>
                          <h4 className="font-display text-sm text-gold font-bold mb-1">Dual Skills</h4>
                          <p className="text-[10px] text-muted-foreground">Rigorous legal reasoning paired with modern technology.</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-secondary/30 border border-gold/10 text-center flex flex-col justify-between h-44">
                        <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 mx-auto text-sm font-black font-mono">2</div>
                        <div>
                          <h4 className="font-display text-sm text-gold font-bold mb-1">Custom Fit</h4>
                          <p className="text-[10px] text-muted-foreground">Every model and document mapped strictly to parameters.</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-secondary/30 border border-gold/10 text-center flex flex-col justify-between h-44">
                        <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 mx-auto text-sm font-black font-mono">3</div>
                        <div>
                          <h4 className="font-display text-sm text-gold font-bold mb-1">Pristine Quality</h4>
                          <p className="text-[10px] text-muted-foreground">Research accuracy and high-speed design validation.</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-secondary/30 border border-gold/10 text-center flex flex-col justify-between h-44">
                        <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 mx-auto text-sm font-black font-mono">4</div>
                        <div>
                          <h4 className="font-display text-sm text-gold font-bold mb-1">Client First</h4>
                          <p className="text-[10px] text-muted-foreground">Strict confidentiality and transparent correspondence.</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-secondary/30 border border-gold/10 text-center flex flex-col justify-between h-44">
                        <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 mx-auto text-sm font-black font-mono">5</div>
                        <div>
                          <h4 className="font-display text-sm text-gold font-bold mb-1">Clear Rates</h4>
                          <p className="text-[10px] text-muted-foreground">Transparent tier lists and competitive price points.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. INDUSTRIES WE SERVE SLIDE */}
                {currentSlide === 7 && (
                  <div className="space-y-6 animate-reveal">
                    <div className="text-center mb-4">
                      <h3 className="font-display text-3xl font-bold text-pink-400 mb-2">Industries We Serve</h3>
                      <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
                        We deliver customized, sector-specific digital solutions and legal assets tailored to unique organizational goals and target demographics.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                      {[
                        { title: "Law Firms & Advocates", icon: Scale, desc: "Elite digital portfolios, local map packs, case brief setups." },
                        { title: "Startups & Small Businesses", icon: Zap, desc: "Airtight client NDAs, SaaS terms, custom automated workflows." },
                        { title: "Students & Researchers", icon: BookOpen, desc: "Rigorous citation alignment, drafting, moot court training folders." },
                        { title: "Freelancers & Professionals", icon: User, desc: "Service agreements, structured resume enhancements." },
                        { title: "NGOs & Non-Profits", icon: Users, desc: "Dynamic compliance templates, donation portal integration." },
                        { title: "Solo Practitioners", icon: Shield, desc: "Personalized letterhead templates, custom business card packs." },
                        { title: "Corporate Legal Departments", icon: Briefcase, desc: "Digital database indexes, searchable PDF bundlers." },
                        { title: "Educational Institutions", icon: Award, desc: "Legal-tech seminars, structured mock trial briefs." }
                      ].map((ind, iIdx) => {
                        const Icon = ind.icon;
                        return (
                          <div key={iIdx} className="p-4 rounded-xl bg-secondary/20 border border-gold/10 flex items-start gap-3">
                            <div className="w-8 h-8 rounded bg-pink-500/15 flex items-center justify-center flex-shrink-0 text-pink-400">
                              <Icon size={14} />
                            </div>
                            <div>
                              <h4 className="text-xs font-mono text-gold uppercase font-bold mb-0.5">{ind.title}</h4>
                              <p className="text-[9px] text-muted-foreground leading-normal">{ind.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 9. WORKING PROCESS SLIDE */}
                {currentSlide === 8 && (
                  <div className="space-y-6 animate-reveal">
                    <div className="text-center mb-6">
                      <h3 className="font-display text-3xl font-bold text-pink-400 mb-2">Our Working Process</h3>
                      <p className="text-xs text-muted-foreground">
                        From raw intent to structured delivery and perpetual expansion, we manage each milestone meticulously.
                      </p>
                    </div>

                    <div className="relative pt-6 max-w-4xl mx-auto">
                      {/* Timeline horizontal background connector */}
                      <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-pink-500/10 via-gold/40 to-pink-500/10 -translate-y-12 hidden md:block" />

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
                        {[
                          { title: "1. Consultation", desc: "Granular discovery logs mapping system goals and constraints." },
                          { title: "2. Planning", desc: "Rigorous milestone timelines and detailed pricing specs." },
                          { title: "3. Execution", desc: "Agile, high-speed code developments and document edits." },
                          { title: "4. Delivery", desc: "Strict quality evaluation, sign-off reviews, and deployments." },
                          { title: "5. Support", desc: "Continuous metadata backups, revisions, and scale-ups." }
                        ].map((proc, pIdx) => (
                          <div key={pIdx} className="p-4 rounded-xl bg-secondary/35 border border-gold/10 text-center relative z-10 hover:bg-[#0d1017] transition-all">
                            <div className="w-8 h-8 rounded-full bg-gold-gradient text-primary-foreground font-black mx-auto mb-3.5 flex items-center justify-center text-xs">
                              {pIdx + 1}
                            </div>
                            <h4 className="font-mono text-xs text-gold uppercase font-bold mb-1.5">{proc.title}</h4>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">{proc.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. FOUNDER & VALUE SYSTEMS SLIDE */}
                {currentSlide === 9 && (
                  <div className="grid md:grid-cols-5 gap-6 animate-reveal">
                    
                    {/* Founder Brief Card */}
                    <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-pink-900/15 to-secondary border border-pink-500/25 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 font-display text-lg font-bold border border-pink-500/30">AS</div>
                          <div>
                            <h4 className="font-display text-xl text-foreground font-bold">Arush Sharma</h4>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400">Founder</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground/90 font-body leading-relaxed">
                          A forward-looking law student and developer passionate about bridging complex jurisprudence structures and modern server capabilities. ASJi is built from the conviction that digital dominance and legal security should exist together seamlessly.
                        </p>
                      </div>

                      <div className="border-t border-gold/10 pt-4 mt-4 space-y-2">
                        <div className="text-[9px] font-mono text-gold uppercase tracking-widest font-black">Direct Contacts</div>
                        <div className="space-y-1">
                          <p className="text-xs font-mono text-muted-foreground">Website: <a href="https://asji.online" className="text-pink-400 hover:underline">asji.online</a></p>
                          <p className="text-xs font-mono text-muted-foreground">LinkedIn: <a href="https://linkedin.com" className="text-pink-400 hover:underline">linkedin.com</a></p>
                          <p className="text-xs font-mono text-muted-foreground">Instagram: <a href="https://instagram.com" className="text-pink-400 hover:underline">instagram.com</a></p>
                        </div>
                      </div>
                    </div>

                    {/* Core Values */}
                    <div className="md:col-span-3 space-y-3.5">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-gold font-bold">Our Core Principles</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { title: "Integrity First", desc: "Honest, reliable advice and complete pricing transparency." },
                          { title: "Absolute Quality", desc: "No templates or boilerplate. Every build is tailored perfectly." },
                          { title: "Tech Innovation", desc: "Employing intelligent AI to optimize administrative speeds." },
                          { title: "Ironclad Secrecy", desc: "Strict client NDAs and highly secure custom cloud structures." }
                        ].map((val, vIdx) => (
                          <div key={vIdx} className="p-3 bg-secondary/30 border border-gold/5 rounded-xl space-y-1">
                            <h5 className="font-display text-sm text-gold font-medium">{val.title}</h5>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">{val.desc}</p>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 bg-pink-500/5 rounded-xl border border-pink-500/10 text-center">
                        <p className="text-[10px] text-muted-foreground italic">&ldquo;Let us help you build a stronger foundation for your practice, your business, and your career.&rdquo;</p>
                      </div>
                    </div>

                  </div>
                )}

              </div>

              {/* SLIDE DECK BOTTOM BAR CARD CONTROLS */}
              <div className="flex items-center justify-between border-t border-gold/10 pt-4 mt-6 z-10 font-mono text-xs">
                <button
                  onClick={() => setCurrentSlide(prev => (prev > 0 ? prev - 1 : 9))}
                  className="flex items-center gap-1 text-muted-foreground hover:text-gold transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>PREVIOUS</span>
                </button>

                <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground text-[10px]">
                  <span>Navigate with keyboard</span>
                  <span className="px-1.5 py-0.5 bg-secondary border border-gold/10 rounded text-[9px] font-black">&larr;</span>
                  <span>/</span>
                  <span className="px-1.5 py-0.5 bg-secondary border border-gold/10 rounded text-[9px] font-black">&rarr;</span>
                </div>

                <button
                  onClick={() => setCurrentSlide(prev => (prev < 9 ? prev + 1 : 0))}
                  className="flex items-center gap-1 text-muted-foreground hover:text-gold transition-colors cursor-pointer"
                >
                  <span>NEXT</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>
          </div>
        )}


        {/* VIEW 2: SCROLLABLE READER MODE (FULL BOOKLET VIEW) */}
        {viewMode === 'scroll' && (
          <div className="space-y-12 max-w-4xl mx-auto">
            {/* Slide 1: Welcome Header */}
            <div className="glass-dark border border-gold/15 rounded-3xl p-8 md:p-14 text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/[0.03] blur-3xl rounded-full" />
              <span className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-[10px] font-mono text-pink-400 font-bold uppercase tracking-widest">
                OFFICIAL COMPANY PROFILE
              </span>
              <h2 className="font-display text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-gold to-pink-300">
                ASJi Web &amp; Legal Solutions
              </h2>
              <div className="w-16 h-0.5 bg-gold-gradient mx-auto" />
              <p className="font-sans text-muted-foreground text-sm max-w-2xl mx-auto leading-relaxed">
                ASJi is a premier tech-legal services firm designed to provide absolute jurisprudential security along with clean, high-performance web engineering. We solve complex compliance issues and scale digital presence for advocate teams, corporate chambers, and modern organizations.
              </p>
              <div className="pt-4 flex items-center justify-center gap-3 flex-wrap">
                <span className="px-3.5 py-1.5 rounded-lg bg-secondary border border-gold/10 font-mono text-[10px] text-gold uppercase tracking-widest">Founded by Arush Sharma</span>
                <span className="px-3.5 py-1.5 rounded-lg bg-secondary border border-gold/10 font-mono text-[10px] text-pink-400 uppercase tracking-widest">Legal-Tech &amp; Digital Presence</span>
              </div>
            </div>

            {/* Slide 2: About Us */}
            <div className="glass-dark border border-gold/15 rounded-3xl p-8 md:p-12 space-y-6">
              <h3 className="font-display text-3xl font-bold text-pink-400 border-b border-gold/10 pb-3">About Us</h3>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                ASJi Web &amp; Legal Solutions is a legal-tech and digital services firm that helps law firms, startups, businesses, and professionals get trusted legal support and a strong online presence in one place. We combine legal expertise, web development, SEO, content, and automation to deliver precise, confidential, and timely solutions that save you time and support growth.
              </p>

              <div className="grid md:grid-cols-3 gap-6 pt-4">
                <div className="space-y-2">
                  <h4 className="font-display text-lg text-gold font-semibold">Our Mission</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">To simplify legal and digital services by delivering high-quality work with professionalism, accuracy, confidentiality, and timely execution for every client we serve.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-display text-lg text-gold font-semibold">Our Vision</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">To build ASJi into a trusted legal-tech brand providing comprehensive legal, web, and digital solutions under one platform while maintaining standard parameters.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-display text-lg text-gold font-semibold">Our Promise</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Every project is handled with complete confidentiality, research-backed accuracy, and a client-first mindset. Only peace of mind is delivered.</p>
                </div>
              </div>
            </div>

            {/* Slide 3: Services Grid */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-display text-3xl font-bold text-pink-400">Services Portfolio</h3>
                <p className="text-xs text-muted-foreground mt-1 text-center">Consolidated overview of active systems, contract draftings, and digital optimizations</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Legal Block */}
                <div className="glass-dark border border-gold/15 rounded-2xl p-6 md:p-8 space-y-4">
                  <div className="flex items-center gap-2 text-gold">
                    <Scale size={20} />
                    <h4 className="font-display text-xl font-bold text-foreground">Legal Services</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">Precise, research-backed legal support for law firms, advocates, businesses, and individuals.</p>
                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2"><CheckCircle2 size={13} className="text-gold flex-shrink-0 mt-0.5" /> <span><strong>Contract Review:</strong> Gaps, liabilities, and recommendations mapping.</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={13} className="text-gold flex-shrink-0 mt-0.5" /> <span><strong>Document Drafting:</strong> Legal notices, MOUs, NDAs, and petitions.</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={13} className="text-gold flex-shrink-0 mt-0.5" /> <span><strong>Deep Legal Research:</strong> Fact histories, citation files, and analytical memos.</span></li>
                  </ul>
                </div>

                {/* Web Block */}
                <div className="glass-dark border border-gold/15 rounded-2xl p-6 md:p-8 space-y-4">
                  <div className="flex items-center gap-2 text-gold">
                    <Globe size={20} />
                    <h4 className="font-display text-xl font-bold text-foreground">Web &amp; Digital Services</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">Visually polished, structurally responsive custom portfolios and firm websites.</p>
                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2"><CheckCircle2 size={13} className="text-gold flex-shrink-0 mt-0.5" /> <span><strong>Advocate Portfolios:</strong> Dynamic bio summaries and intake systems.</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={13} className="text-gold flex-shrink-0 mt-0.5" /> <span><strong>Law Firm Webs:</strong> Comprehensive corporate practice catalogs.</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={13} className="text-gold flex-shrink-0 mt-0.5" /> <span><strong>Technical SEO:</strong> Content boosts, schemas, map positioning audits.</span></li>
                  </ul>
                </div>

                {/* Content Block */}
                <div className="glass-dark border border-gold/15 rounded-2xl p-6 md:p-8 space-y-4">
                  <div className="flex items-center gap-2 text-gold">
                    <FileText size={20} />
                    <h4 className="font-display text-xl font-bold text-foreground">Content &amp; Documentation</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">Pristine legal copywriting, reports, and career rebranding packs.</p>
                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2"><CheckCircle2 size={13} className="text-gold flex-shrink-0 mt-0.5" /> <span><strong>Professional Resumes:</strong> Cover letters and LinkedIn optimizations.</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={13} className="text-gold flex-shrink-0 mt-0.5" /> <span><strong>Legal Copywriting:</strong> Publication-grade journals, articles, and reviews.</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={13} className="text-gold flex-shrink-0 mt-0.5" /> <span><strong>Business Files:</strong> Standard presentation decks and clean proposals.</span></li>
                  </ul>
                </div>

                {/* AI Block */}
                <div className="glass-dark border border-gold/15 rounded-2xl p-6 md:p-8 space-y-4">
                  <div className="flex items-center gap-2 text-gold">
                    <Bot size={20} />
                    <h4 className="font-display text-xl font-bold text-foreground">AI &amp; Automation</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">Streamlining intensive client intakes and communications automatically.</p>
                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2"><CheckCircle2 size={13} className="text-gold flex-shrink-0 mt-0.5" /> <span><strong>AI Workflow Setup:</strong> Automated messaging systems and notifications.</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={13} className="text-gold flex-shrink-0 mt-0.5" /> <span><strong>Intelligent Chatbots:</strong> FAQ nodes for qualification screening.</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={13} className="text-gold flex-shrink-0 mt-0.5" /> <span><strong>Document Automation:</strong> Instantly triggered draft templates.</span></li>
                  </ul>
                </div>

              </div>
            </div>

            {/* Slide 4: Strategic Benefits */}
            <div className="glass-dark border border-gold/15 rounded-3xl p-8 md:p-12 space-y-6">
              <h3 className="font-display text-2xl font-bold text-pink-400 border-b border-gold/10 pb-3 text-center">Value Proposition</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { title: "Legal + Tech Domain", desc: "True execution synergy. We speak code and code jurisprudence." },
                  { title: "Completely Bespoke", desc: "We avoid templates. Every layout and filing is bespoke." },
                  { title: "Premium Accuracy", desc: "Exemplary precision on legal terms and web setups alike." },
                  { title: "Confidentiality", desc: "Non-disclosure mandates and highly resilient, private hosting assets." },
                  { title: "Fair Pricing", desc: "Competitive, transparent tiered rate structures with clear listings." }
                ].map((valProp, vIdx) => (
                  <div key={vIdx} className="p-4 bg-secondary/35 border border-gold/10 rounded-xl text-center space-y-2">
                    <span className="font-mono text-gold text-lg font-black">{vIdx + 1}</span>
                    <h5 className="font-display text-sm text-foreground font-semibold">{valProp.title}</h5>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{valProp.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide 5: Industries & Process */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-dark border border-gold/15 rounded-2xl p-6 md:p-8 space-y-4">
                <h4 className="font-display text-xl font-bold text-pink-400 border-b border-gold/10 pb-2">Industries We Serve</h4>
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    "Law Firms & Advocates",
                    "Startups & Small Businesses",
                    "Students & Researchers",
                    "Freelancers & Corporate Professionals",
                    "NGOs & Non-Profits",
                    "Solo Practitioners",
                    "Corporate Legal Departments",
                    "Educational Institutions"
                  ].map((ind, idx) => (
                    <span key={idx} className="bg-secondary px-3 py-1.5 rounded-lg border border-gold/10 text-xs font-mono text-muted-foreground hover:text-gold transition-colors">{ind}</span>
                  ))}
                </div>
              </div>

              <div className="glass-dark border border-gold/15 rounded-2xl p-6 md:p-8 space-y-4">
                <h4 className="font-display text-xl font-bold text-pink-400 border-b border-gold/10 pb-2">Our Process</h4>
                <div className="space-y-3 pt-2">
                  {[
                    { title: "1. Consultation", desc: "Establish project bounds, limits, and system parameters." },
                    { title: "2. Strategic Planning", desc: "Map exact workflows and complete budget schedules." },
                    { title: "3. Precision Execution", desc: "Perform deep research or code builds cleanly." },
                    { title: "4. Deployment & Launch", desc: "Launch dynamic systems, final reviews, and legal signoffs." },
                    { title: "5. Active Support", desc: "Keep web instances up to date and adapt database profiles." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      <span className="w-5 h-5 rounded-full bg-gold/10 text-gold text-[10px] font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                      <div>
                        <h5 className="font-display text-sm text-foreground font-medium">{item.title}</h5>
                        <p className="text-[10px] text-muted-foreground leading-normal">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Slide 6: Founder & Contact Details */}
            <div className="glass-dark border border-gold/15 rounded-3xl p-8 md:p-12 grid md:grid-cols-5 gap-8">
              
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border border-pink-500 bg-secondary flex items-center justify-center font-display text-lg text-pink-400 font-bold">
                    AS
                  </div>
                  <div>
                    <h4 className="font-display text-xl font-bold text-foreground">Arush Sharma</h4>
                    <span className="text-xs font-mono text-pink-400">Founder</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                  A law student and technology builder focusing developer advocacy, cloud setups, and jurisprudential advisory. Built ASJi to consolidate these critical solutions.
                </p>
                <div className="bg-pink-500/5 p-4 rounded-xl border border-pink-500/10">
                  <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                    &ldquo;Our pledge is that every legal brief or digital platform is designed and evaluated with absolute dedication and precision.&rdquo;
                  </p>
                </div>
              </div>

              <div className="md:col-span-3 space-y-4">
                <h4 className="font-display text-lg text-gold font-semibold border-b border-gold/10 pb-2">Core Values &amp; Contacts</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-mono text-[10px] uppercase font-bold text-gold">&bull; Transparency</h5>
                    <p className="text-[10px] text-muted-foreground leading-normal">Clear pricing guides, strict milestone timelines, objective consultation guidance.</p>
                  </div>
                  <div>
                    <h5 className="font-mono text-[10px] uppercase font-bold text-gold">&bull; Quality</h5>
                    <p className="text-[10px] text-muted-foreground leading-normal">Refined outputs built specifically to your guidelines.</p>
                  </div>
                  <div>
                    <h5 className="font-mono text-[10px] uppercase font-bold text-gold">&bull; Security</h5>
                    <p className="text-[10px] text-muted-foreground leading-normal">Ironclad confidentiality agreements and private data standards.</p>
                  </div>
                  <div>
                    <h5 className="font-mono text-[10px] uppercase font-bold text-gold">&bull; Collaboration</h5>
                    <p className="text-[10px] text-muted-foreground leading-normal">Responsive correspondence across all project steps.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gold/10 mt-4 flex justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-[9px] uppercase font-mono tracking-widest text-muted-foreground">Digital Coordinates</p>
                    <p className="text-xs font-mono text-foreground">Website: <a href="https://asji.online" className="text-pink-400 underline">asji.online</a></p>
                    <p className="text-xs font-mono text-foreground">Service List: <a href="https://asji.online/#services" className="text-pink-400 underline">asji.online/#services</a></p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-mono tracking-widest text-muted-foreground">Social Directs</p>
                    <p className="text-xs font-mono text-foreground">LinkedIn: <a href="https://linkedin.com" className="text-pink-400 underline">linkedin.com</a></p>
                    <p className="text-xs font-mono text-foreground">Instagram: <a href="https://instagram.com" className="text-pink-400 underline">instagram.com</a></p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="relative z-40 max-w-7xl mx-auto px-6 py-8 border-t border-gold/10 text-center text-xs text-muted-foreground print:hidden">
        <p className="font-display font-light text-foreground text-sm">&copy; 2026 ASJi Web &amp; Legal Solutions. All rights reserved.</p>
        <p className="font-mono text-[9px] tracking-widest text-gold/40 mt-1 uppercase">Legal + Digital. One team. One platform.</p>
      </footer>

      {/* PRINT-ONLY OUTLINE STYLINGS (HIGH END LAYOUT DESIGN) */}
      <div className="hidden print:block absolute inset-0 bg-white text-black p-0">
        {/* We dynamically generate 10 beautiful full-page slides for printing */}
        {slidesData.map((slide, sIdx) => (
          <div key={slide.id} className="w-full min-h-screen flex flex-col justify-between p-16 border-2 border-black/15 bg-white text-black page-break-after-always relative" style={{ pageBreakAfter: 'always', height: '100%' }}>
            
            {/* Header */}
            <div className="flex justify-between items-center border-b-2 border-black/15 pb-4 mb-8">
              <div>
                <h4 className="font-serif text-2xl font-bold tracking-wider text-black">ASJi Web &amp; Legal Solutions</h4>
                <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-600">Legal + Digital. One team. One platform.</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs text-neutral-500">{slide.category}</span>
                <p className="font-mono text-[10px] text-neutral-500">PAGE {sIdx + 1} OF 10</p>
              </div>
            </div>

            {/* Print Slide Body */}
            <div className="flex-1 flex flex-col justify-center py-6">
              
              {/* Cover Print */}
              {sIdx === 0 && (
                <div className="text-center space-y-8">
                  <div className="inline-block px-4 py-1.5 border border-black text-xs font-mono tracking-widest font-bold uppercase">
                    FOUNDED BY ARUSH SHARMA
                  </div>
                  <h1 className="font-serif text-5xl md:text-6xl font-black text-black tracking-tight mt-6">
                    ASJi Web &amp; Legal Solutions
                  </h1>
                  <p className="font-serif text-2xl italic text-neutral-600 max-w-2xl mx-auto mt-4">
                    &ldquo;Legal + Digital. One team. One platform.&rdquo;
                  </p>
                  <div className="w-24 h-0.5 bg-black mx-auto mt-6" />
                  <p className="text-sm text-neutral-700 max-w-xl mx-auto leading-relaxed mt-4">
                    A premium tech-legal services firm supplying advocates, young chambers, and corporate startups with elite contract advisory, citation analysis, custom web portfolios, and AI automation.
                  </p>
                  <div className="mt-10 font-mono text-xs text-neutral-600">
                    Website Address: asji.online/profile
                  </div>
                </div>
              )}

              {/* About Us Print */}
              {sIdx === 1 && (
                <div className="space-y-8">
                  <h2 className="font-serif text-4xl font-bold text-black border-b border-black pb-2">About ASJi</h2>
                  <p className="text-sm text-neutral-800 leading-relaxed">
                    ASJi Web &amp; Legal Solutions is a legal-tech and digital services firm that helps law firms, startups, businesses, and professionals get trusted legal support and a strong online presence in one place. We combine legal expertise, web development, SEO, content, and automation to deliver precise, confidential, and timely solutions that save you time and support growth.
                  </p>
                  <div className="grid grid-cols-3 gap-6 pt-4">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-black">Our Mission</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed mt-2">To simplify legal and digital services by delivering high-quality work with professionalism, accuracy, confidentiality, and timely execution.</p>
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-black">Our Vision</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed mt-2">To build ASJi into a trusted legal-tech brand providing comprehensive legal, web, and digital solutions under one unified platform.</p>
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-black">Our Promise</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed mt-2">Every project is handled with complete confidentiality, research-backed accuracy, and a client-first mindset. Peace of mind is delivered.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Legal Services Print */}
              {sIdx === 2 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-4xl font-bold text-black border-b border-black pb-2">⚖️ Legal Services</h2>
                  <p className="text-sm text-neutral-800 leading-relaxed">
                    ASJi provides precise, research-backed legal support for law firms, advocates, businesses, and individuals. We focus on contract review, legal documentation, and legal research to deliver court-ready work that is accurate, polished, and action-oriented.
                  </p>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="p-4 border border-black/20 rounded">
                      <h4 className="font-mono text-xs font-bold uppercase mb-2">Contract Review</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">Meticulous review to identify operational risks, structural liabilities, contractual loopholes, and improvements.</p>
                    </div>
                    <div className="p-4 border border-black/20 rounded">
                      <h4 className="font-mono text-xs font-bold uppercase mb-2">Agreement Drafting</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">Draft professional legal notices, partnership deeds, client service MOUs, employee NDAs, and courtroom petitions.</p>
                    </div>
                    <div className="p-4 border border-black/20 rounded">
                      <h4 className="font-mono text-xs font-bold uppercase mb-2">Precedent &amp; Citation</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">Thorough, citation-ready research memorandum briefs and case histories formatted to court specifications.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Web Services Print */}
              {sIdx === 3 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-4xl font-bold text-black border-b border-black pb-2">💻 Web &amp; Digital Services</h2>
                  <p className="text-sm text-neutral-800 leading-relaxed">
                    ASJi helps law firms, businesses, and professionals build a stronger online presence with websites that are visually polished, responsive, and built to perform.
                  </p>
                  <div className="grid grid-cols-2 gap-6 pt-4">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-black">&bull; Portfolio &amp; Corporate Websites</h4>
                      <p className="text-xs text-neutral-600 leading-normal mt-1">Excellent single or multi-page systems built for advocates and chambers including lead intake filters and calendar slots.</p>
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-black">&bull; Technical Search Optimization (SEO)</h4>
                      <p className="text-xs text-neutral-600 leading-normal mt-1">Dominate local regions using map positioning setups, speed score upgrades, schema markup and competitor assessment portfolios.</p>
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-black">&bull; Conversion &amp; Performance Tuning</h4>
                      <p className="text-xs text-neutral-600 leading-normal mt-1">Optimize and fix loading lag, construct airtight metadata layouts, and enable robust server deployment files.</p>
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-black">&bull; Dynamic Layout Maintenance</h4>
                      <p className="text-xs text-neutral-600 leading-normal mt-1">Periodic diagnostic backups, database cleaning operations, code revisions, and directory security enhancements.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Services Print */}
              {sIdx === 4 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-4xl font-bold text-black border-b border-black pb-2">✍️ Content &amp; Documentation</h2>
                  <p className="text-sm text-neutral-800 leading-relaxed">
                    ASJi creates clear, polished content and professional documentation that helps you present your best self — quickly and effectively. We focus on resume writing, legal content, and business-ready documentation tailored to your goals and audience.
                  </p>
                  <div className="grid grid-cols-3 gap-6 pt-4">
                    <div className="p-4 border border-black/20 rounded">
                      <span className="font-mono text-[9px] uppercase font-bold text-neutral-500">SECTION 1</span>
                      <h4 className="font-serif text-base font-bold text-black mt-1">Resume Writing</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed mt-1.5">Resumes, cover letters, and professional LinkedIn bio copies customized to establish corporate credibility.</p>
                    </div>
                    <div className="p-4 border border-black/20 rounded">
                      <span className="font-mono text-[9px] uppercase font-bold text-neutral-500">SECTION 2</span>
                      <h4 className="font-serif text-base font-bold text-black mt-1">Legal Content</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed mt-1.5">Publication-grade legal drafting, informative guidelines, legal journals, and custom advocate briefs.</p>
                    </div>
                    <div className="p-4 border border-black/20 rounded">
                      <span className="font-mono text-[9px] uppercase font-bold text-neutral-500">SECTION 3</span>
                      <h4 className="font-serif text-base font-bold text-black mt-1">Business Files</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed mt-1.5">Elite proposals, project reports, slides, spreadsheets, and document formatting services.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Services Print */}
              {sIdx === 5 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-4xl font-bold text-black border-b border-black pb-2">🤖 AI &amp; Automation Services</h2>
                  <p className="text-sm text-neutral-800 leading-relaxed">
                    ASJi helps businesses, law firms, and professionals streamline workflows with intelligent automation and AI-powered tools. We identify high-impact opportunities, reduce manual effort, and deliver faster, more efficient operations.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-4 border border-black/10 rounded">
                      <h4 className="font-mono text-xs font-bold text-black uppercase mb-1">1. Onboarding Automations</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">Automated template triggering, instant onboarding forms, and scheduler alerts to log leads automatically.</p>
                    </div>
                    <div className="p-4 border border-black/10 rounded">
                      <h4 className="font-mono text-xs font-bold text-black uppercase mb-1">2. Chatbot Integration</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">Qualifying assistant chatbots that engage and direct inquiries dynamically, reducing manual sorting times.</p>
                    </div>
                    <div className="p-4 border border-black/10 rounded">
                      <h4 className="font-mono text-xs font-bold text-black uppercase mb-1">3. Document Synthesizers</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">Structured agreement generators that compile custom inputs into standard outlines in minutes.</p>
                    </div>
                    <div className="p-4 border border-black/10 rounded">
                      <h4 className="font-mono text-xs font-bold text-black uppercase mb-1">4. Productivity Channels</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">Secure integrations linking calendars, spreadsheets, CRM profiles, and official client WhatsApp feeds.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Value Proposition Print */}
              {sIdx === 6 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-4xl font-bold text-black border-b border-black pb-2">Why Choose ASJi</h2>
                  <p className="text-sm text-neutral-800 leading-relaxed">
                    We deliver the ultimate combination of technical web engineering and in-depth, authoritative jurisprudential research.
                  </p>
                  <div className="grid grid-cols-5 gap-4 pt-4">
                    {[
                      { t: "Legal + Tech", d: "Synergistic mastery across both domains." },
                      { t: "Bespoke Builds", d: "No templates. Handcrafted layouts." },
                      { t: "Precision", d: "Exemplary accuracy on all drafts." },
                      { t: "Ironclad Privacy", d: "Strict client NDAs and secure code." },
                      { t: "Fair Fees", d: "Competitive, transparent rate menus." }
                    ].map((it, idx) => (
                      <div key={idx} className="p-3 border border-black/20 rounded text-center">
                        <span className="font-mono text-sm font-bold text-black">{idx + 1}</span>
                        <h4 className="font-serif text-xs font-bold text-black mt-2">{it.t}</h4>
                        <p className="text-[10px] text-neutral-500 mt-1">{it.d}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Industries Serve Print */}
              {sIdx === 7 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-4xl font-bold text-black border-b border-black pb-2">Industries We Serve</h2>
                  <p className="text-sm text-neutral-800 leading-relaxed">
                    Providing tailor-made, clean solutions spanning digital presence cards and legal filing databases across eight core circles:
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {[
                      { t: "Law Firms & Advocates", d: "Digital bio grids, local map pack visibility, case history brief templates." },
                      { t: "Startups & Small Businesses", icon: Zap, d: "Employee NDAs, service licenses, SaaS terms of use contracts." },
                      { t: "Students & researchers", d: "Moot court written briefs, Bluebook citation setups." },
                      { t: "Freelancers & Corporate Circles", d: "Contract drafting, customized career portfolios." },
                      { t: "NGOs & Non-Profits", d: "Compliance documents, payment system integrations." },
                      { t: "Solo Practitioners", d: "Personal logo vectors, letterhead print layouts." },
                      { t: "Corporate Legal Departments", d: "Database indices and fully searchable PDF books." },
                      { t: "Educational Associations", d: "Tech-advocacy seminars and moot mock trials." }
                    ].map((it, idx) => (
                      <div key={idx} className="p-3 border border-black/15 rounded flex gap-3">
                        <div className="font-mono text-xs font-bold text-black">[{idx+1}]</div>
                        <div>
                          <h4 className="font-mono text-xs font-bold text-neutral-800 uppercase">{it.t}</h4>
                          <p className="text-[10px] text-neutral-600 mt-0.5">{it.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Process Print */}
              {sIdx === 8 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-4xl font-bold text-black border-b border-black pb-2">Our Design &amp; Work Process</h2>
                  <p className="text-sm text-neutral-800 leading-relaxed">
                    Constructing each project with strict milestones to ensure professional accuracy:
                  </p>
                  <div className="grid grid-cols-5 gap-4 pt-4">
                    {[
                      { step: "1. Consult", desc: "Explicit discovery logs to map limits." },
                      { step: "2. Strategic Planning", desc: "Establish workflows and budget tiers." },
                      { step: "3. Execution", desc: "High-speed coding and legal drafting." },
                      { step: "4. Delivery", desc: "Rigorous quality evaluation tests." },
                      { step: "5. Active Support", desc: "Perpetual database backups." }
                    ].map((it, idx) => (
                      <div key={idx} className="p-4 border border-black/20 rounded text-center">
                        <span className="font-mono text-xs font-black text-black">STEP 0{idx+1}</span>
                        <h4 className="font-serif text-xs font-bold text-black mt-2">{it.step}</h4>
                        <p className="text-[10px] text-neutral-500 mt-1">{it.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Founder Print */}
              {sIdx === 9 && (
                <div className="grid grid-cols-5 gap-8">
                  <div className="col-span-2 p-5 border-2 border-black rounded flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-2xl font-bold text-black">Arush Sharma</h4>
                      <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-600 mt-0.5">FOUNDER</p>
                      <p className="text-xs text-neutral-800 leading-relaxed mt-4 font-sans">
                        A dedicated law student and systems developer who blends legal reasoning with code architecture. Founded ASJi to equip advocates with outstanding digital credentials and comprehensive contractual safety.
                      </p>
                    </div>
                    <div className="border-t border-black/15 pt-4 mt-6">
                      <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-800 font-bold">Contact Coordinates</p>
                      <p className="text-xs font-mono text-neutral-700 mt-2">Website: asji.online</p>
                      <p className="text-xs font-mono text-neutral-700">LinkedIn: linkedin.com/in/arush-sharma</p>
                      <p className="text-xs font-mono text-neutral-700">Instagram: @asji.online</p>
                    </div>
                  </div>

                  <div className="col-span-3 space-y-4">
                    <h3 className="font-serif text-2xl font-bold text-black border-b border-black pb-2">Core Organizational Integrity</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-mono text-xs font-bold text-neutral-800 uppercase">&bull; Transparency</h4>
                        <p className="text-[10px] text-neutral-600 leading-normal">Clear service rate ledger lists and direct consultation feedback loops.</p>
                      </div>
                      <div>
                        <h4 className="font-mono text-xs font-bold text-neutral-800 uppercase">&bull; Quality</h4>
                        <p className="text-[10px] text-neutral-600 leading-normal">Zero generic boilerplate. Handcrafting every draft page and system layout.</p>
                      </div>
                      <div>
                        <h4 className="font-mono text-xs font-bold text-neutral-800 uppercase">&bull; Secrecy</h4>
                        <p className="text-[10px] text-neutral-600 leading-normal">Complete non-disclosure mandates on files and database pipelines.</p>
                      </div>
                      <div>
                        <h4 className="font-mono text-xs font-bold text-neutral-800 uppercase">&bull; Support</h4>
                        <p className="text-[10px] text-neutral-600 leading-normal font-sans">Constant layout optimizations and metadata compliance security.</p>
                      </div>
                    </div>
                    <div className="p-4 border border-black border-dashed rounded text-center mt-6">
                      <p className="text-xs italic text-neutral-700">&ldquo;Let us help you build a stronger foundation for your practice, your business, and your career.&rdquo;</p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="border-t-2 border-black/15 pt-4 text-center">
              <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">ASJi CO. REGISTERED DOCUMENT &bull; SECURE PDF EXPORT &bull; WWW.ASJI.ONLINE</span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
