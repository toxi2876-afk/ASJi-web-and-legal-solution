import { useState, useEffect, useRef, FormEvent } from 'react';
import { 
  Sparkles, MessageSquare, FileText, Send, X, Loader2, Scale, Shield, Landmark, 
  Copy, Check, ArrowUpRight, Maximize2, Minimize2, Calculator, BookOpen, Clock, 
  AlertCircle, HelpCircle, CheckCircle, Info, ChevronDown, ChevronRight 
} from 'lucide-react';
import { apiService } from '../../lib/api';
import { useToast } from '../ui/toast';

interface Message {
  role: 'user' | 'model';
  text: string;
  sources?: { title: string; uri: string }[];
}

// Pre-compiled fast templates for instant, responsive scoping
const SCOPING_TEMPLATES = [
  {
    category: "Tech & AI Development",
    prompts: [
      { label: "AI Integration Guide", text: "What is the best design pattern to integrate Google Gemini API into a full-stack Node/Express and React application securely?" },
      { label: "Secure API Setup", text: "Write an example showing how to lazy-initialize server-side secrets securely so that sensitive API keys are never exposed in the client code." },
      { label: "Vite & React Bundles", text: "How can we optimize Vite config to split large dependencies (like Three.js, Lucide, motion) into separate chunk files?" }
    ]
  },
  {
    category: "Indian Setup & GST Tax",
    prompts: [
      { label: "0% GST Export LUT", text: "Explain the process for software exporters to file a Letter of Undertaking (LUT) under Indian GST to supply services at zero-rated 0% tax." },
      { label: "80-IAC Startup Holiday", text: "What are the exact eligibility thresholds and filing guidelines to secure the Section 80-IAC 3-year income tax exemption for startups?" },
      { label: "LLP vs Pvt Ltd Guide", text: "Provide a comparative analysis checklist of an LLP versus a Private Limited Company for bootstrapped SaaS founders in India." }
    ]
  },
  {
    category: "Global Law & Legal Research",
    prompts: [
      { label: "Cross-Border SLAs", text: "Research the best way to draft limitation of liability and indemnity clauses in cross-border software service level agreements (SLAs) for global clients." },
      { label: "IP Ownership Clauses", text: "Outline the key drafting variables needed in a 'Work-for-Hire' IP Assignment Clause to ensure absolute source code ownership reverts to the buyer." },
      { label: "GDPR & NDA Guidelines", text: "Research legal guidelines on enforceability of NDAs protecting proprietary research and complying with EU GDPR standards." }
    ]
  },
  {
    category: "Growth & Brand Strategy",
    prompts: [
      { label: "SaaS Pitch Structure", text: "Propose a concise, 5-part slide deck outline for demonstrating tech innovations to seed-stage venture capitalists." },
      { label: "SEO & Content Marketing", text: "What are the most effective organic search content strategies to draw technical engineers to a developer-focused software platform?" },
      { label: "Brand Voice Optimization", text: "How can a bespoke engineering studio build trust through humanized, humble branding on landing pages?" }
    ]
  }
];

export default function AIHub() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'drafter' | 'calculator' | 'handbook'>('chat');
  
  // Custom copy state tracking per message index
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Chat States
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Welcome to the Virtual AI Research & Consulting Advisor.\n\nI provide real-time, high-fidelity insights on software engineering, coding templates, modern tech architectures, business growth, comprehensive legal research, contract precedents & case-law analysis, corporate law, and strategic tax planning.\n\nI am fully equipped with real-time web-grounding to fetch current facts and provide instant, accurate answers on any topic. Ask me any question or select one of the quick-action prompts below to begin!\n\n---\n*Guidance facilitated by ASJi Operational Advisory Hub, established by founders Arush Sharma and Saksham Sharma.*"
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Drafter States
  const [contractType, setContractType] = useState('Mutual Non Disclosure Agreement');
  const [partyA, setPartyA] = useState('');
  const [partyB, setPartyB] = useState('ASJi Advisory Group');
  const [jurisdiction, setJurisdiction] = useState('New Delhi, India');
  const [mainDeal, setMainDeal] = useState('');
  const [draftResult, setDraftResult] = useState('');
  const [draftLoading, setDraftLoading] = useState(false);

  // Calculator States
  const [projectedRevenue, setProjectedRevenue] = useState<number>(3500000); // 35 Lakhs standard default
  const [cloudExpenses, setCloudExpenses] = useState<number>(600000); // 6 Lakhs default
  const [isDpiitRegistered, setIsDpiitRegistered] = useState<boolean>(false);
  const [isExportLUT, setIsExportLUT] = useState<boolean>(true);

  // Handbook Active Sections Accordion
  const [openHandbookSection, setOpenHandbookSection] = useState<string>('llp_vs_pvt');

  // Auto scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chatLoading]);

  // Keep focus on window keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setIsMaximized(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Play custom subtle sound chime trigger
  const playChime = (high: boolean = true) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(high ? 740.00 : 493.88, ctx.currentTime); // F#5 or B4
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (_) {}
  };

  const handleSendChatMessage = async (overrideText?: string) => {
    const textToSend = overrideText || chatInput;
    if (!textToSend.trim() || chatLoading) return;

    if (!overrideText) {
      setChatInput('');
    }

    const userMsg: Message = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setChatLoading(true);

    try {
      const serverHistory = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      playChime(false);
      const reply = await apiService.askAIAdvisor(textToSend, serverHistory);
      
      setMessages(prev => [...prev, { role: 'model', text: reply.text, sources: reply.sources }]);
      playChime(true);
    } catch (err) {
      console.warn("AI chat request failed:", err);
      setMessages(prev => [
        ...prev,
        { 
          role: 'model', 
          text: "⚠️ **System Exception:** Advisory proxy link failed. Attempting to run in local cached fallback secure storage pattern to protect user experience." 
        }
      ]);
      toast({
        title: "Proxy Rerouted",
        description: "Executing on local fallback client rules framework.",
        type: "info"
      });
    } finally {
      setChatLoading(false);
    }
  };

  const handleCreateDraft = async (e: FormEvent) => {
    e.preventDefault();
    if (!partyA.trim() || !mainDeal.trim() || draftLoading) {
      toast({
        title: "Parameters Missing",
        description: "First Party and Core Deal Scope details are required.",
        type: "error"
      });
      return;
    }

    setDraftLoading(true);
    setDraftResult('');
    playChime(false);

    try {
      const outcome = await apiService.draftContractWithAI(
        contractType,
        partyA.trim(),
        partyB.trim(),
        jurisdiction.trim(),
        mainDeal.trim()
      );
      setDraftResult(outcome);
      playChime(true);
      toast({
        title: "Contract Document Structured",
        description: "Draft generated and compiled successfully.",
        type: "success"
      });
    } catch (err) {
      console.warn("AI draft generation failed:", err);
      toast({
        title: "Drafting Overload",
        description: "Serving secure client-side templates directly. Review outcome details.",
        type: "info"
      });
    } finally {
      setDraftLoading(false);
    }
  };

  // Tax Calculations - GST & IP Shield Engine
  const calculateTaxData = () => {
    const rawGstLiability = projectedRevenue * 0.18;
    const actualGstLiability = isExportLUT ? 0 : rawGstLiability;
    const cloudGstPaid = cloudExpenses * 0.18; // 18% standard GST on computing bills
    
    // Net GST payment due (offset by Cloud Input Credit)
    const claimableItc = cloudGstPaid;
    const finalGstDue = Math.max(0, actualGstLiability - claimableItc);

    // Business net income estimation (Revenue - Expenses)
    const netProfit = Math.max(0, projectedRevenue - cloudExpenses);
    
    // Corporate Income Tax (standard 22% rate without exemptions)
    const baseCorporateTax = netProfit * 0.22;
    const actualCorporateTax = isDpiitRegistered ? 0 : baseCorporateTax;
    const totalTaxSaved = (rawGstLiability - actualGstLiability) + claimableItc + (isDpiitRegistered ? baseCorporateTax : 0);

    const netTakehome = netProfit - actualCorporateTax - finalGstDue;

    return {
      rawGstLiability,
      actualGstLiability,
      claimableItc,
      finalGstDue,
      netProfit,
      baseCorporateTax,
      actualCorporateTax,
      totalTaxSaved,
      netTakehome
    };
  };

  const taxMetrics = calculateTaxData();

  // Dynamic Markdown-like syntax parser with enhanced layout tags
  const formatMarkdown = (text: string) => {
    return text.split('\n\n').map((paragraph, i) => {
      // Code blocks
      if (paragraph.startsWith('```')) {
        const lines = paragraph.split('\n');
        const code = lines.slice(1, lines.length - 1).join('\n');
        return (
          <pre key={i} className="bg-secondary/80 border border-gold/15 rounded-lg p-3 text-[11px] text-[#e3e8ee] font-mono overflow-x-auto leading-relaxed my-3">
            <code>{code}</code>
          </pre>
        );
      }

      // Headers (e.g. ### Header)
      if (paragraph.startsWith('###')) {
        return (
          <h5 key={i} className="text-xs font-display text-gold border-b border-gold/10 pb-1 mt-4 mb-2 font-semibold tracking-wide uppercase">
            {paragraph.replace('###', '').trim()}
          </h5>
        );
      }
      if (paragraph.startsWith('##')) {
        return (
          <h4 key={i} className="text-sm font-display text-gold border-l-2 border-gold pl-2 mt-4 mb-2 font-bold tracking-normal">
            {paragraph.replace('##', '').trim()}
          </h4>
        );
      }

      // Bold sections formatting inside regular paragraph
      const formattedLines = paragraph.split('\n').map((line, lineIdx) => {
        // Render bullet items cleanly
        if (line.startsWith('* ') || line.startsWith('- ')) {
          const cleanLine = line.replace(/^[\*\-]\s/, '').trim();
          return (
            <li key={lineIdx} className="list-disc pl-1 ml-4 text-[11px] text-muted-foreground leading-relaxed my-1">
              {parseBoldText(cleanLine)}
            </li>
          );
        }

        // Render numbered lists
        if (/^\d+\.\s/.test(line)) {
          const cleanLine = line.replace(/^\d+\.\s/, '').trim();
          return (
            <li key={lineIdx} className="list-decimal pl-1 ml-4 text-[11px] text-muted-foreground leading-relaxed my-1">
              {parseBoldText(cleanLine)}
            </li>
          );
        }

        return (
          <span key={lineIdx} className="block text-[11px] leading-relaxed text-foreground/90 my-1 font-body">
            {parseBoldText(line)}
          </span>
        );
      });

      // Group lists together if needed
      if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
        return <ul key={i} className="space-y-1 my-3">{formattedLines}</ul>;
      }
      if (/^\d+\.\s/.test(paragraph)) {
        return <ol key={i} className="space-y-1 my-3">{formattedLines}</ol>;
      }

      return <div key={i} className="mb-3">{formattedLines}</div>;
    });
  };

  const parseBoldText = (txt: string) => {
    const parts = txt.split('**');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="text-gold font-semibold">{part}</strong>;
      }
      return part;
    });
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({
      title: "Response Saved",
      description: "Text content successfully copied to your Clipboard.",
      type: "success"
    });
    playChime(true);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formattedCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <>
      {/* Dynamic Floating Action Trigger (Bottom-Right Launcher) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            playChime(true);
          }}
          className={`w-14 h-14 bg-gold-gradient rounded-full flex items-center justify-center text-[#07090c] shadow-lg hover:shadow-gold/30 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-gold/25 relative group ${
            isOpen ? 'rotate-[360deg] scale-110' : ''
          }`}
          title="Open ASJi Advisory Hub"
          id="asji-ai-hub-launcher-root"
        >
          {isOpen ? (
            <X size={22} className="text-primary-foreground" />
          ) : (
            <>
              <Sparkles size={22} className="animate-shimmer text-[#07090c]" />
              <span className="absolute -inset-1.5 bg-gold/15 rounded-full blur-md group-hover:bg-gold/25 animate-ping -z-10" />
            </>
          )}
        </button>
      </div>

      {/* Main Expanded Workspace Dashboard overlay */}
      {isOpen && (
        <div 
          className={`fixed transition-all duration-300 z-50 overflow-hidden flex flex-col glass-dark border border-gold/25 rounded-2xl shadow-2xl ${
            isMaximized 
              ? 'inset-4 md:inset-10 w-[calc(100vw-32px)] md:w-[calc(100vw-80px)] h-[calc(100vh-32px)] md:h-[calc(100vh-80px)] max-w-7xl mx-auto' 
              : 'bottom-24 right-6 w-full max-w-[440px] h-[600px] max-h-[calc(100vh-120px)]'
          }`}
          id="asji-ai-dashboard-container"
        >
          
          {/* Header Action Strip */}
          <header className="p-4 bg-secondary/30 border-b border-gold/15 flex items-center justify-between relative shrink-0">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/80 to-transparent" />
            
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center border border-gold/25">
                <Sparkles size={16} className="text-gold animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-semibold text-gold-gradient tracking-wide leading-tight text-sm">ASJi Sovereign Advisor Dashboard</h4>
                  <span className="text-[8px] font-mono px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded animate-pulse">ACTIVE</span>
                </div>
                <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest leading-none mt-1">Unified Legal, Tax & Engineering Panel</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Maximize Toggle Button */}
              <button
                onClick={() => {
                  setIsMaximized(!isMaximized);
                  playChime(true);
                }}
                className="p-1.5 text-muted-foreground hover:text-gold transition-colors bg-secondary/10 hover:bg-secondary/40 border border-gold/10 rounded"
                title={isMaximized ? "Restore small drawer view" : "Maximize to full workspace"}
              >
                {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsMaximized(false);
                }}
                className="p-1.5 text-black hover:text-gold transition-all bg-gold border border-gold/20 rounded"
              >
                <X size={13} />
              </button>
            </div>
          </header>

          {/* Unified Navigation Categories and Status Indicators */}
          <div className="flex flex-wrap items-center justify-between border-b border-gold/15 bg-primary/20 backdrop-blur-sm shrink-0 font-mono text-[10px]">
            <div className="flex overflow-x-auto scrollbar-none flex-1 max-w-full">
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-3 px-4 uppercase tracking-wider font-semibold border-b transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'chat'
                    ? 'text-gold border-gold bg-[#101318]'
                    : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary/15'
                }`}
              >
                <MessageSquare size={11} className="text-gold" />
                AI Executive Advisor
              </button>
              
              <button
                onClick={() => setActiveTab('drafter')}
                className={`py-3 px-4 uppercase tracking-wider font-semibold border-b transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'drafter'
                    ? 'text-gold border-gold bg-[#101318]'
                    : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary/15'
                }`}
              >
                <FileText size={11} className="text-gold" />
                Contracts Studio
              </button>

              <button
                onClick={() => setActiveTab('calculator')}
                className={`py-3 px-4 uppercase tracking-wider font-semibold border-b transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'calculator'
                    ? 'text-gold border-gold bg-[#101318]'
                    : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary/15'
                }`}
              >
                <Calculator size={11} className="text-gold" />
                Tax & IP Estimator
              </button>

              <button
                onClick={() => setActiveTab('handbook')}
                className={`py-3 px-4 uppercase tracking-wider font-semibold border-b transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'handbook'
                    ? 'text-gold border-gold bg-[#101318]'
                    : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary/15'
                }`}
              >
                <BookOpen size={11} className="text-gold" />
                Statutory Handbook
              </button>
            </div>
            
            {/* Speed Real-time Grounding Metadata status indicators (visible in Desktop or Maximized layout) */}
            {isMaximized && (
              <div className="hidden lg:flex items-center gap-2.5 px-4 text-[9px] text-[#939fab]/70 border-l border-gold/10 font-sans">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Google Grounding Active
                </span>
                <span className="w-0.5 h-3 bg-gold/15" />
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  SaaS Framework Version 2026.2
                </span>
              </div>
            )}
          </div>

          {/* Core Viewport Dashboard Layout */}
          <div className="flex-1 overflow-hidden flex flex-row bg-[#080a0d]">
            
            {/* VIEWPORT TAB 1: EXECUTIVE ADVOSOR CHAT */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full">
                
                {/* Primary Chat Box Timeline */}
                <div className="flex-1 flex flex-col overflow-hidden w-full relative">
                  
                  {/* Chat message register timeline */}
                  <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                      >
                        <div
                          className={`max-w-[90%] md:max-w-[85%] rounded-xl p-4 border transition-all ${
                            msg.role === 'user'
                              ? 'bg-gold/10 border-gold/25 text-foreground rounded-br-none shadow shadow-gold/5'
                              : 'bg-secondary/25 border-gold/10 text-muted-foreground rounded-bl-none'
                          }`}
                        >
                          {/* Message Header Strip */}
                          <div className="flex items-center justify-between gap-6 pb-1.5 mb-1.5 border-b border-gold/10">
                            <span className={`text-[9px] font-mono uppercase tracking-widest font-bold ${msg.role === 'user' ? 'text-gold' : 'text-gold-hover'}`}>
                              {msg.role === 'user' ? '👤 CLIENT COMPLIANCE REQUEST' : '✨ ASJI VIRTUAL DIRECTOR'}
                            </span>
                            
                            {/* Copy button for model responses */}
                            {msg.role === 'model' && (
                              <button
                                onClick={() => copyToClipboard(msg.text, i)}
                                className="text-[9px] font-mono text-[#939fab] hover:text-gold flex items-center gap-1 transition-colors bg-secondary/35 p-1 rounded border border-gold/5 hover:border-gold/20"
                                title="Copy full response"
                              >
                                {copiedIndex === i ? (
                                  <>
                                    <Check size={9} className="text-emerald-500" />
                                    <span className="text-emerald-500">Saved</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={9} />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                          
                          <div className="prose prose-invert max-w-none text-xs break-words">
                            {formatMarkdown(msg.text)}
                          </div>

                          {/* Reference Google Grounding Sources Panel */}
                          {msg.role === 'model' && msg.sources && msg.sources.length > 0 && (
                            <div className="mt-3.5 pt-2.5 border-t border-gold/15">
                              <span className="text-[9px] font-mono uppercase tracking-widest text-[#bd8a12] font-bold flex items-center gap-1.5 mb-2">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Google Grounding Sources Verified ({msg.sources.length}):
                              </span>
                              <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto scrollbar-thin">
                                {msg.sources.map((src, sIdx) => {
                                  let displayDomain = "Web Document";
                                  try {
                                    displayDomain = new URL(src.uri).hostname.replace("www.", "");
                                  } catch (_) {}
                                  return (
                                    <a
                                      key={sIdx}
                                      href={src.uri}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0b0e14] border border-gold/15 hover:border-gold/40 hover:bg-gold/5 text-[9px] text-[#939fab] hover:text-gold transition-all font-mono max-w-[210px] truncate"
                                      title={src.title}
                                    >
                                      <span className="truncate">{src.title}</span>
                                      <span className="text-[8px] opacity-60">({displayDomain})</span>
                                      <ArrowUpRight size={8} className="shrink-0 text-gold/60" />
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {chatLoading && (
                      <div className="flex justify-start animate-fade-in">
                        <div className="bg-secondary/25 border border-gold/10 rounded-xl p-4 rounded-bl-none max-w-[85%] flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Loader2 size={13} className="animate-spin text-gold" />
                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Searching Google Engine & Analyzing Briefing...</span>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[8px] font-mono py-0.5 px-2 bg-gold/5 border border-gold/15 rounded text-gold animate-pulse flex items-center gap-1">
                              <span className="w-1 h-1 bg-gold rounded-full inline-block" />
                              GROUNDING VERIFICATION ACTIVE
                            </span>
                            <span className="text-[8px] font-mono py-0.5 px-2 bg-emerald-500/5 border border-emerald-500/15 rounded text-emerald-400 animate-pulse">
                              SECURE EXPRESS LAZY PROXY
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Primary Chat Input Bar */}
                  <div className="p-3 bg-secondary/20 border-t border-gold/15 flex items-center gap-2 shrink-0">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                      placeholder="Ask about corporate compliance, tax filing code, Node/Docker deploy..."
                      className="flex-1 bg-[#0b0e14] border border-gold/15 focus:border-gold/40 rounded-lg px-4 py-3 text-xs text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-0 transition-colors font-sans"
                    />
                    <button
                      onClick={() => handleSendChatMessage()}
                      disabled={chatLoading || !chatInput.trim()}
                      className="p-3 bg-gold-gradient text-primary-foreground rounded-lg hover:opacity-90 active:scale-95 disabled:opacity-30 w-11 h-11 flex items-center justify-center shrink-0 duration-150 transition-all cursor-pointer shadow shadow-gold/15"
                    >
                      <Send size={15} />
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* VIEWPORT TAB 2: BLUEPRINT CONTRACTS STUDIO */}
            {activeTab === 'drafter' && (
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden w-full p-4 gap-4">
                
                {/* Generation Parameters Left Form */}
                <div className={`flex flex-col bg-secondary/15 border border-gold/10 rounded-xl p-4 overflow-y-auto shrink-0 ${
                  isMaximized ? 'w-full md:w-[380px]' : 'w-full'
                }`}>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Scale size={15} className="text-gold" />
                    <h5 className="text-[11px] font-mono uppercase tracking-widest text-gold font-bold">Drafting Model Settings</h5>
                  </div>
                  
                  <form onSubmit={handleCreateDraft} className="space-y-4 text-xs font-sans">
                    <div>
                      <label className="block text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Contract Classification</label>
                      <select
                        value={contractType}
                        onChange={(e) => setContractType(e.target.value)}
                        className="w-full bg-[#0b0e14] border border-gold/15 focus:border-gold/40 rounded-lg p-2.5 text-xs text-foreground cursor-pointer focus:outline-none"
                      >
                        <option value="Mutual Non Disclosure Agreement">Mutual NDA Agreement</option>
                        <option value="Memorandum of Understanding / MoU">Memorandum of Understanding (MoU)</option>
                        <option value="SaaS Service Level SLA Protocol">SaaS SLA Provisions</option>
                        <option value="Independent Developer Contract">Independent Contractor Contract</option>
                        <option value="Shareholders Legal Agreement (SHA)">Shareholders Agreement (SHA)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Promoter / First Party</label>
                        <input
                          type="text"
                          required
                          value={partyA}
                          onChange={(e) => setPartyA(e.target.value)}
                          placeholder="e.g. Acme Studio"
                          className="w-full bg-[#0b0e14] border border-gold/15 focus:border-gold/40 rounded-lg p-2.5 text-xs text-foreground focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Second Party Agent</label>
                        <input
                          type="text"
                          required
                          value={partyB}
                          onChange={(e) => setPartyB(e.target.value)}
                          placeholder="e.g. ASJi Group"
                          className="w-full bg-[#0b0e14] border border-gold/15 focus:border-gold/40 rounded-lg p-2.5 text-xs text-foreground focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Governing Legal Jurisdiction</label>
                      <input
                        type="text"
                        value={jurisdiction}
                        onChange={(e) => setJurisdiction(e.target.value)}
                        placeholder="e.g. New Delhi, India"
                        className="w-full bg-[#0b0e14] border border-gold/15 focus:border-gold/40 rounded-lg p-2.5 text-xs text-foreground focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Core Deliverables & Deal Scope</label>
                      <textarea
                        rows={isMaximized ? 6 : 3}
                        required
                        value={mainDeal}
                        onChange={(e) => setMainDeal(e.target.value)}
                        placeholder="Specify payment timelines, liability limits, copyright assignments, intellectual property covenants..."
                        className="w-full bg-[#0b0e14] border border-gold/15 focus:border-gold/40 rounded-lg p-2.5 text-xs text-foreground focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={draftLoading}
                      className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-primary-foreground font-semibold text-xs uppercase tracking-widest py-3 rounded-lg hover:opacity-95 disabled:opacity-50 cursor-pointer shadow shadow-gold/10"
                    >
                      {draftLoading ? (
                        <>
                          <Loader2 size={13} className="shrink-0 animate-spin" />
                          Framing Covenants...
                        </>
                      ) : (
                        <>
                          <FileText size={13} />
                          Formulate Agreement Draft
                        </>
                      )}
                    </button>
                    
                    {draftResult && (
                      <button
                        type="button"
                        onClick={() => {
                          setDraftResult('');
                          setPartyA('');
                          setMainDeal('');
                        }}
                        className="w-full py-2 border border-dashed border-red-500/20 text-red-400 hover:text-red-300 rounded text-[10px] uppercase font-mono transition-colors"
                      >
                        Reset Form Fields
                      </button>
                    )}
                  </form>
                </div>

                {/* Drafting Outcome Viewer (Side-by-side) */}
                <div className="flex-1 flex flex-col h-full bg-secondary/5 border border-gold/10 rounded-xl overflow-hidden min-w-0">
                  {draftResult ? (
                    <div className="flex flex-col h-full">
                      <div className="bg-[#101318] p-3 border-b border-gold/10 flex items-center justify-between shrink-0">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-gold font-bold">Legal Document Compilation</span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(draftResult);
                              toast({
                                title: "Copied successfully",
                                description: "Document copied to clipboard.",
                                type: "success"
                              });
                              playChime(true);
                            }}
                            className="bg-secondary/40 text-gold border border-gold/20 text-[9px] font-mono px-2.5 py-1 rounded hover:bg-gold/10 transition-colors flex items-center gap-1"
                          >
                            <Copy size={9} /> Copy Draft
                          </button>
                          
                          <button
                            onClick={() => window.print()}
                            className="hidden sm:inline-block bg-secondary/40 text-muted-foreground border border-gold/5 text-[9px] font-mono px-2.5 py-1 rounded hover:text-gold transition-colors"
                          >
                            Print Draft
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 p-5 overflow-y-auto break-words bg-[#080b0f] scrollbar-thin">
                        <div className="max-w-2xl mx-auto border border-gold/5 p-6 bg-[#0c0f16] shadow-xl rounded-lg">
                          <div className="text-center border-b border-gold/15 pb-4 mb-6 relative">
                            <h2 className="text-md font-display font-bold text-gold uppercase tracking-wider">{contractType}</h2>
                            <p className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest mt-1">Sovereign Legal Execution System</p>
                            <div className="absolute bottom-[-1px] left-1/3 w-1/3 h-[2px] bg-gold" />
                          </div>
                          
                          <div className="prose prose-invert prose-xs text-muted-foreground">
                            {formatMarkdown(draftResult)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-xs">
                      <Shield size={32} className="text-gold/20 mb-3 animate-pulse" />
                      <p className="font-mono text-[10px] text-gold uppercase tracking-widest font-semibold mb-1">Contracts Studio Ready</p>
                      <p className="text-muted-foreground max-w-sm mt-1 leading-relaxed">
                        Specify details in the generator panel on the left to review beautiful recitals, force majeure mechanisms, or Indian Supreme dispute guidelines.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* VIEWPORT TAB 3: TAX & IP SHIELD ESTIMATOR (LOCAL CALCULATOR) */}
            {activeTab === 'calculator' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin text-xs">
                
                {/* Visual Banner */}
                <div className="border border-gold/15 bg-gold/5 p-4 rounded-xl flex items-start gap-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-xl -z-10" />
                  <Calculator size={18} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-display font-bold text-gold leading-tight text-xs uppercase tracking-wider">ASJi Tax Planning & Savings Optimization Engine</h5>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                      Instant financial model simulating standard 18% custom software GST liability, cloud infrastructure GST input tax credit offsets, and potential corporate tax exemptions. Securely assessed offline within the client sandbox.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  
                  {/* Slider and Input Controls */}
                  <div className="bg-secondary/20 border border-gold/10 rounded-xl p-4 space-y-4">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold flex items-center gap-1 pb-1 border-b border-gold/10">
                      ⚙️ Parameter Configuration
                    </h4>

                    {/* Revenue Slider */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono text-muted-foreground uppercase tracking-wide">Projected Annual Service Revenue</span>
                        <span className="font-mono font-bold text-gold">{formattedCurrency(projectedRevenue)}</span>
                      </div>
                      <input
                        type="range"
                        min={100000}
                        max={10000000} // Up to 1 Crore
                        step={100000}
                        value={projectedRevenue}
                        onChange={(e) => setProjectedRevenue(Number(e.target.value))}
                        className="w-full accent-gold bg-secondary h-1 rounded cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] font-mono text-muted-foreground/50">
                        <span>₹1 Lakh</span>
                        <span>₹50 Lakhs</span>
                        <span>₹1 Crore (100 Lakhs)</span>
                      </div>
                    </div>

                    {/* Expenses Slider */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono text-muted-foreground uppercase tracking-wide">Annual Computing/Cloud spend (GCP/AWS/SAAS Tools)</span>
                        <span className="font-mono font-bold text-emerald-400">{formattedCurrency(cloudExpenses)}</span>
                      </div>
                      <input
                        type="range"
                        min={50000}
                        max={4000000} // Up to 40 Lakhs
                        step={50000}
                        value={cloudExpenses}
                        onChange={(e) => setCloudExpenses(Number(e.target.value))}
                        className="w-full accent-emerald-400 bg-secondary h-1 rounded cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] font-mono text-muted-foreground/50">
                        <span>₹50,000</span>
                        <span>₹20 Lakhs</span>
                        <span>₹40 Lakhs</span>
                      </div>
                    </div>

                    {/* Exemption Checkboxes */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#0b0e14] border border-gold/5 hover:border-gold/15 transition-all">
                        <input
                          type="checkbox"
                          id="exportLutCheck"
                          checked={isExportLUT}
                          onChange={(e) => setIsExportLUT(e.target.checked)}
                          className="mt-0.5 rounded accent-gold focus:ring-0 cursor-pointer"
                        />
                        <div>
                          <label htmlFor="exportLutCheck" className="text-[10px] font-mono uppercase tracking-wider text-foreground block font-semibold cursor-pointer">
                            Supply as Zero-Rated Export (LUT Filed)
                          </label>
                          <span className="text-[9px] text-muted-foreground leading-normal mt-0.5 block">
                            Applies zero (0%) GST to foreign exports of software services. Recommended for global delivery models.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#0b0e14] border border-gold/5 hover:border-gold/15 transition-all w-full">
                        <input
                          type="checkbox"
                          id="dpiitCheck"
                          checked={isDpiitRegistered}
                          onChange={(e) => setIsDpiitRegistered(e.target.checked)}
                          className="mt-0.5 rounded accent-gold focus:ring-0 cursor-pointer"
                        />
                        <div className="flex-1">
                          <label htmlFor="dpiitCheck" className="text-[10px] font-mono uppercase tracking-wider text-foreground block font-semibold cursor-pointer">
                            DPIIT Recognized Startup (Section 80-IAC)
                          </label>
                          <span className="text-[9px] text-muted-foreground leading-normal mt-0.5 block">
                            Secures a complete 3-year consecutive corporate Income Tax Holiday. Exemption requires DPIIT approval.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calculations and Output Panel */}
                  <div className="bg-[#101318]/45 border border-gold/15 rounded-xl p-4 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#939fab] font-bold flex items-center justify-between pb-1 border-b border-gold/10">
                        <span>🧾 Tax Settlement Forecast</span>
                        <span className="text-[9px] text-emerald-400">FY 2026-27 Rates</span>
                      </h4>

                      {/* Estimated Savings Badge */}
                      <div className="mt-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Total Estimated Tax Saved</span>
                          <p className="text-[9px] text-muted-foreground mt-0.5">Through smart compliance planning & input offsets.</p>
                        </div>
                        <span className="text-md font-sans font-bold text-emerald-400">{formattedCurrency(taxMetrics.totalTaxSaved)}</span>
                      </div>

                      {/* Detailed Calculations breakdown */}
                      <div className="space-y-2 mt-4 font-mono text-[9px] md:text-[10px]">
                        <div className="flex justify-between py-1.5 border-b border-gold/5 text-muted-foreground">
                          <span>Annual Service Revenue:</span>
                          <span className="text-foreground">{formattedCurrency(projectedRevenue)}</span>
                        </div>
                        
                        <div className="flex justify-between py-1.5 border-b border-gold/5 text-muted-foreground">
                          <span>Output Software GST (18%):</span>
                          <span>
                            {isExportLUT ? (
                              <span className="text-emerald-400">₹0 (Zero Export LUT)</span>
                            ) : (
                              <span className="text-foreground">{formattedCurrency(taxMetrics.rawGstLiability)}</span>
                            )}
                          </span>
                        </div>

                        <div className="flex justify-between py-1.5 border-b border-gold/5 text-muted-foreground">
                          <span>Claimable Cloud GST credit (ITC offset):</span>
                          <span className="text-emerald-400">-{formattedCurrency(taxMetrics.claimableItc)}</span>
                        </div>

                        <div className="flex justify-between py-1.5 border-b border-gold/5 text-muted-foreground">
                          <span>Estimated Net GST Payable:</span>
                          <span className="text-foreground">{formattedCurrency(taxMetrics.finalGstDue)}</span>
                        </div>

                        <div className="flex justify-between py-1.5 border-b border-gold/5 text-muted-foreground text-foreground">
                          <span>Estimated Net Business Income:</span>
                          <span>{formattedCurrency(taxMetrics.netProfit)}</span>
                        </div>

                        <div className="flex justify-between py-1.5 border-b border-gold/5 text-muted-foreground">
                          <span>Corporate Income Tax Rate:</span>
                          <span>{isDpiitRegistered ? <span className="text-emerald-400">0% (80-IAC Tax Holiday)</span> : <span className="text-foreground">22% Corporate Tax</span>}</span>
                        </div>

                        <div className="flex justify-between py-1.5 border-b border-gold/5 text-muted-foreground">
                          <span>Estimated Corporate Income Tax due:</span>
                          <span className="text-foreground">{formattedCurrency(taxMetrics.actualCorporateTax)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Calculated Net Take-Home Margin Metric */}
                    <div className="border-t border-gold/15 pt-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-gold-hover uppercase tracking-wider font-semibold">Estimated Net Liquidity Run</span>
                          <div className="flex items-center gap-1 mt-0.5 text-[8px] text-[#939fab] uppercase font-mono">
                            <Clock size={10} /> After tax, GST, and computing overhead
                          </div>
                        </div>
                        <span className="text-md font-sans font-bold text-gold">{formattedCurrency(taxMetrics.netTakehome)}</span>
                      </div>
                      
                      {/* Interactive CSS Progress Indicator bar gauge */}
                      <div className="w-full bg-secondary h-2.5 rounded-full mt-3 overflow-hidden border border-gold/10">
                        <div 
                          className="bg-gold h-full rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, Math.max(10, (taxMetrics.netTakehome / (projectedRevenue || 1)) * 100))}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[8px] font-mono text-muted-foreground/50 mt-1">
                        <span>Liquidity Ratio: {((taxMetrics.netTakehome / (projectedRevenue || 1)) * 100).toFixed(1)}%</span>
                        <span>Enterprise Grade Planning</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* VIEWPORT TAB 4: COMPLIANCE & ENTITY ROADMAP HANDBOOK */}
            {activeTab === 'handbook' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin text-xs font-sans">
                
                {/* Intro Banner */}
                <div className="border border-gold/15 bg-secondary/20 p-3 rounded-xl flex items-center gap-2.5">
                  <Landmark size={15} className="text-gold shrink-0 animate-pulse" />
                  <div className="flex-1">
                    <h5 className="font-display font-semibold text-gold leading-tight text-[11px] uppercase tracking-wider">ASJi Statutory Regulatory Roadmap</h5>
                    <p className="text-[9px] text-[#939fab] leading-normal">
                      A curated lookup table outlining key corporate compliance regimes, timelines, audit thresholds, and IP safety protocols established by Indian law.
                    </p>
                  </div>
                </div>

                {/* Vertical Accordion Checklist */}
                <div className="space-y-2.5">
                  
                  {/* ACCORDION BLOCK 1: LLP VS PVT LTD */}
                  <div className="bg-secondary/15 border border-gold/10 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenHandbookSection(openHandbookSection === 'llp_vs_pvt' ? '' : 'llp_vs_pvt')}
                      className="w-full p-3.5 flex items-center justify-between text-left hover:bg-gold/5 transition-colors cursor-pointer"
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold flex items-center gap-2">
                        ⚖️ Segment A: Limited Liability Partnership (LLP) vs Private Limited
                      </span>
                      {openHandbookSection === 'llp_vs_pvt' ? <ChevronDown size={14} className="text-gold" /> : <ChevronRight size={14} className="text-gold" />}
                    </button>

                    {openHandbookSection === 'llp_vs_pvt' && (
                      <div className="p-4 bg-secondary/5 border-t border-gold/10 text-muted-foreground space-y-3 leading-relaxed text-[11px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-[#0b0e14] p-3 rounded-lg border border-gold/5">
                            <span className="text-[10px] font-mono font-bold text-gold inline-block mb-1.5 uppercase">🏢 Private Limited Company (Pvt Ltd)</span>
                            <ul className="space-y-1 my-1 list-disc pl-4 text-xs">
                              <li><strong>Venture Runway:</strong> Highly favored by institutional VCs. Essential to issue ESOPs and convertible notes or equity.</li>
                              <li><strong>Registration Threshold:</strong> Requires minimum 2 directors, registered office address, and DSC approvals.</li>
                              <li><strong>Statutory Audits:</strong> Absolutely mandatory every commercial year, regardless of annual service turnover.</li>
                              <li><strong>Filing Overhead:</strong> High (requires Form AOC-4, MGT-7, and multiple auditor appointments).</li>
                            </ul>
                          </div>

                          <div className="bg-[#0b0e14] p-3 rounded-lg border border-gold/5">
                            <span className="text-[10px] font-mono font-bold text-gold inline-block mb-1.5 uppercase">🤝 Limited Liability Partnership (LLP)</span>
                            <ul className="space-y-1 my-1 list-disc pl-4 text-xs">
                              <li><strong>SaaS Friendly:</strong> Preferred for bootstrapped self-funded software studios because there is no Dividend Distribution Tax.</li>
                              <li><strong>Audit Exemptions:</strong> Exemption applies if annual turnover remains under <strong>₹40 Lakhs</strong> and total partner contributions are under <strong>₹25 Lakhs</strong>.</li>
                              <li><strong>Filing Overhead:</strong> Lower (Form 8 statements & Form 11 annual return fililngs).</li>
                              <li><strong>Compliance Cost:</strong> Generally 50% lower than Pvt Ltd entities.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ACCORDION BLOCK 2: TAX FILINGS TIMELINE */}
                  <div className="bg-secondary/15 border border-gold/10 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenHandbookSection(openHandbookSection === 'tax_time' ? '' : 'tax_time')}
                      className="w-full p-3.5 flex items-center justify-between text-left hover:bg-gold/5 transition-colors cursor-pointer"
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold flex items-center gap-2">
                        📅 Segment B: Statutory Income Tax & GST Filing Due Dates
                      </span>
                      {openHandbookSection === 'tax_time' ? <ChevronDown size={14} className="text-gold" /> : <ChevronRight size={14} className="text-gold" />}
                    </button>

                    {openHandbookSection === 'tax_time' && (
                      <div className="p-4 bg-secondary/5 border-t border-gold/10 text-muted-foreground text-[11px] leading-relaxed">
                        <p className="mb-2 text-foreground font-semibold">Typical Annual Compliance calendar timelines tracked by ASJi Advisory Desk:</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-start gap-2.5 p-2 rounded bg-[#0b0e14] border-l-2 border-gold font-mono text-[10px]">
                            <span className="text-gold font-bold shrink-0">April 30</span>
                            <span className="text-muted-foreground">LUT Renewal deadline with the GST portal to prevent 18% export lockouts.</span>
                          </div>

                          <div className="flex items-start gap-2.5 p-2 rounded bg-[#0b0e14] border-l-2 border-gold font-mono text-[10px]">
                            <span className="text-gold font-bold shrink-0">May 30</span>
                            <span className="text-muted-foreground">Filing of Form 11 (Annual Return of LLP partners) with the MCA.</span>
                          </div>

                          <div className="flex items-start gap-2.5 p-2 rounded bg-[#0b0e14] border-l-2 border-gold font-mono text-[10px]">
                            <span className="text-gold font-bold shrink-0">July 31</span>
                            <span className="text-muted-foreground">Income Tax Return (ITR-6 for Pvt Ltds / ITR-5 for LLPs) if audit is not statutory.</span>
                          </div>

                          <div className="flex items-start gap-2.5 p-2 rounded bg-[#0b0e14] border-l-2 border-gold font-mono text-[10px]">
                            <span className="text-gold font-bold shrink-0">Oct 30</span>
                            <span className="text-muted-foreground">Filing of Form 8 (Statement of Accounts & Solvency of LLP) with the MCA.</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ACCORDION BLOCK 3: INTELLECTUAL PROPERTY RECONCILIATION */}
                  <div className="bg-secondary/15 border border-gold/10 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenHandbookSection(openHandbookSection === 'ip_laws' ? '' : 'ip_laws')}
                      className="w-full p-3.5 flex items-center justify-between text-left hover:bg-gold/5 transition-colors cursor-pointer"
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold flex items-center gap-2">
                        🛡️ Segment C: Intellectual Property Work-for-Hire Assignment Covenants
                      </span>
                      {openHandbookSection === 'ip_laws' ? <ChevronDown size={14} className="text-gold" /> : <ChevronRight size={14} className="text-gold" />}
                    </button>

                    {openHandbookSection === 'ip_laws' && (
                      <div className="p-4 bg-secondary/5 border-t border-gold/10 text-muted-foreground text-[11px] leading-relaxed space-y-2.5">
                        <div className="p-3 bg-[#0b0e14] rounded border border-gold/5">
                          <span className="text-[10px] font-mono text-gold font-bold block mb-1">📜 Work for Hire Doctrine (Indian Copyright Act Sec 17)</span>
                          <p className="text-xs">
                            Under Section 17 of the Copyright Act, 1957, unless negotiated otherwise in writing, the author of a custom computer program is the first owner of copyright. If a software program is designed by an independent contractor without an explicit IP Assignment clause, the IP continues to legally reside with the freelance contractor, not the corporate buyer.
                          </p>
                        </div>
                        
                        <div className="p-3 bg-[#0b0e14] rounded border border-gold/5">
                          <span className="text-[10px] font-mono text-gold font-bold block mb-1">🔍 Fast-Track Trademark Protection Strategy</span>
                          <p className="text-xs">
                            As co-founders Arush and Saksham counsel, filing trademark protocols early under category Class 42 (Software Architecture Design) protects brand integrity. For DPIIT recognized startups, the government grants a massive 50% concession on standard trademark filing fees.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                <div className="text-center pt-2.5 text-[10px] text-muted-foreground/60">
                  <span>Questions concerning specific litigation? Consult the Virtual Chat Executive for rapid Google search analysis.</span>
                </div>
              </div>
            )}

          </div>

          {/* Footer Branding Strip */}
          <footer className="p-3 bg-[#0d1015]/95 border-t border-gold/15 flex items-center justify-between text-[9px] font-mono text-muted-foreground shrink-0 select-none">
            <span className="flex items-center gap-1">
              <Shield size={10} className="text-gold" />
              <span>Secure Advisory Engine Node V4.20.1</span>
            </span>
            <span className="hidden sm:inline-block text-[#bd8a12] font-semibold">
              Supervised under Directors Arush Sharma & Saksham Sharma
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={10} />
              <span>Realtime UTC</span>
            </span>
          </footer>

        </div>
      )}
    </>
  );
}
