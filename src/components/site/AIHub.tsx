import { useState, useEffect, useRef, FormEvent } from 'react';
import { Sparkles, MessageSquare, FileText, Send, X, Loader2, Scale, Shield, Landmark, PlayCircle, HelpCircle, Check, ArrowUpRight } from 'lucide-react';
import { apiService } from '../../lib/api';
import { useToast } from '../ui/toast';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AIHub() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'drafter'>('chat');
  
  // Chat States
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Welcome to the ASJi Sovereign Advisory Portal! \n\nI am your secure, virtual AI Executive. Under the governance of directors Arush Sharma and Saksham Sharma, I am equipped to analyze technical architectures, web operations, regulatory frameworks, tax checklists, or SaaS drafts. How can I facilitate your team's objectives today?"
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Drafter States
  const [contractType, setContractType] = useState('Mutual NDA Agreement');
  const [partyA, setPartyA] = useState('');
  const [partyB, setPartyB] = useState('ASJi Consulting Group');
  const [jurisdiction, setJurisdiction] = useState('New Delhi, India');
  const [mainDeal, setMainDeal] = useState('');
  const [draftResult, setDraftResult] = useState('');
  const [draftLoading, setDraftLoading] = useState(false);

  // Auto scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chatLoading]);

  // Play custom visual chime tone
  const playChime = (high: boolean = true) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(high ? 783.99 : 523.25, ctx.currentTime); // G5 or C5
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
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
      // Map existing messages format to history list expected by the Gemini chat helper
      const serverHistory = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      playChime(false);
      const reply = await apiService.askAIAdvisor(textToSend, serverHistory);
      
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
      playChime(true);
    } catch (err) {
      console.warn("AI chat request failed:", err);
      setMessages(prev => [
        ...prev,
        { role: 'model', text: "❌ **System Notice:** Secure client-server proxy pipeline timeout. Ensure your API token configuration secrets is active inside AI Studio." }
      ]);
      toast({
        title: "Advisor Offline",
        description: "Secure engine link timeout. Please verify API configuration credentials.",
        type: "error"
      });
    } finally {
      setChatLoading(false);
    }
  };

  const handleCreateDraft = async (e: FormEvent) => {
    e.preventDefault();
    if (!partyA.trim() || !mainDeal.trim() || draftLoading) {
      toast({
        title: "Parameters Incomplete",
        description: "Please specify first party promoter name and core deal specifications to frame draft.",
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
        title: "Draft Outline Framework Generated",
        description: "Exquisite contract clauses framed successfully by ASJi AI Model.",
        type: "success"
      });
    } catch (err) {
      console.warn("AI draft generation failed:", err);
      toast({
        title: "Interrupted Blueprint",
        description: "Drafting pipeline encountered a connection block.",
        type: "error"
      });
    } finally {
      setDraftLoading(false);
    }
  };

  // Quick Prompt Recommendations
  const quickPrompts = [
    { label: "SaaS Tech Roadmap", text: "Propose high-level secure tech architecture guidelines for financial SaaS apps with database isolation." },
    { label: "India Tax Filings Timeline", text: "Explain typical annual tax filing timeline checklists and regulatory guidelines for businesses in India." },
    { label: "IP Protection Check", text: "Detail standard milestones ASJi implements to protect customer IP and Source Code during web projects." }
  ];

  // Robust internal helper for custom markup rendering to bypass external package risks
  const formatMarkdown = (text: string) => {
    return text.split('\n\n').map((paragraph, i) => {
      // Check for raw formatting blocks
      if (paragraph.startsWith('```')) {
        const lines = paragraph.split('\n');
        const code = lines.slice(1, lines.length - 1).join('\n');
        return (
          <pre key={i} className="bg-primary/45 border border-gold/15 rounded-lg p-3 text-[10px] text-gold font-mono overflow-x-auto leading-relaxed my-3 mb-4">
            <code>{code}</code>
          </pre>
        );
      }

      // Check for bullet lists
      if (paragraph.startsWith('* ') || paragraph.startsWith('- ') || paragraph.includes('\n* ') || paragraph.includes('\n- ')) {
        const bulletPoints = paragraph.split(/\n[\*\-]\s/).map((bullet, k) => {
          const clean = bullet.replace(/^[\*\-]\s/, '').trim();
          if (!clean) return null;
          return <li key={k} className="list-disc pl-1 ml-4 text-[11px] leading-relaxed text-muted-foreground my-0.5">{clean}</li>;
        }).filter(Boolean);
        return <ul key={i} className="space-y-1 my-3">{bulletPoints}</ul>;
      }

      // Standard text line
      return <p key={i} className="text-xs leading-relaxed text-foreground/90 font-body mb-3">{paragraph}</p>;
    });
  };

  return (
    <>
      {/* Floating launcher badge bottom right */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            playChime(true);
          }}
          className={`w-14 h-14 bg-gold-gradient rounded-full flex items-center justify-center text-primary-foreground shadow-lg hover:shadow-gold/30 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-gold/20 relative group ${
            isOpen ? 'rotate-90' : ''
          }`}
          title="Open ASJi Intelligence Hub"
          id="ai-hub-launcher"
        >
          {isOpen ? (
            <X size={20} />
          ) : (
            <>
              <Sparkles size={20} className="animate-pulse" />
              {/* Pulse effect */}
              <span className="absolute -inset-1 bg-gold/10 rounded-full blur-sm group-hover:bg-gold/20 animate-ping -z-10" />
            </>
          )}
        </button>
      </div>

      {/* Expanded Advisor Pane Panel Desktop Slider */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-[420px] h-[550px] glass-dark border border-gold/25 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col animate-fade-in text-sm font-sans">
          
          {/* Header */}
          <header className="p-4 bg-secondary/25 border-b border-gold/15 flex items-center justify-between relative">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/80 to-transparent" />
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
                <Sparkles size={14} className="text-gold animate-shimmer" />
              </div>
              <div>
                <h4 className="font-display font-medium text-gold-gradient leading-tight">ASJi AI Hub</h4>
                <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest leading-none mt-0.5">Secure Gemini Broker</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-muted-foreground hover:text-gold transition-colors bg-secondary/10 rounded"
            >
              <X size={15} />
            </button>
          </header>

          {/* Navigation Category Tabs */}
          <div className="flex border-b border-gold/10 bg-primary/40 font-mono text-[10px] select-none text-center">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2.5 uppercase tracking-wider font-semibold border-b transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'text-gold border-gold bg-secondary/10'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              <MessageSquare size={12} />
              AI Executive Advisor
            </button>
            <button
              onClick={() => setActiveTab('drafter')}
              className={`flex-1 py-2.5 uppercase tracking-wider font-semibold border-b transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'drafter'
                  ? 'text-gold border-gold bg-secondary/10'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              <FileText size={12} />
              Contracts Studio
            </button>
          </div>

          {/* Tab Viewports */}
          <div className="flex-1 overflow-hidden flex flex-col bg-background/5">
            {activeTab === 'chat' ? (
              /* TAB 1: CONVERSATIONAL CHAT */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Scroll chat list area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl p-3.5 border ${
                          msg.role === 'user'
                            ? 'bg-gold/10 border-gold/25 text-foreground rounded-br-none'
                            : 'bg-secondary/20 border-gold/5 text-muted-foreground rounded-bl-none'
                        }`}
                      >
                        {/* Speaker ID badge */}
                        <div className="flex items-center gap-1 mb-1.5">
                          <span className={`text-[9px] font-mono uppercase tracking-widest font-semibold ${msg.role === 'user' ? 'text-gold' : 'text-gold-shimmer'}`}>
                            {msg.role === 'user' ? 'Client Request' : 'ASJi Virtual Director'}
                          </span>
                        </div>
                        
                        <div className="prose prose-invert prose-xs max-w-none text-xs break-words">
                          {formatMarkdown(msg.text)}
                        </div>
                      </div>
                    </div>
                  ))}

                  {chatLoading && (
                    <div className="flex justify-start animate-pulse">
                      <div className="bg-secondary/20 border border-gold/5 rounded-xl p-3.5 rounded-bl-none max-w-[80%] flex items-center gap-2">
                        <Loader2 size={12} className="animate-spin text-gold" />
                        <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">Compiling strategic audit...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recommendation chips list */}
                {messages.length === 1 && (
                  <div className="p-3 bg-secondary/10 border-t border-gold/5 space-y-1.5">
                    <p className="text-[9px] font-mono uppercase text-muted-foreground/80 tracking-widest px-1">Suggested inquiries:</p>
                    <div className="flex flex-col gap-1">
                      {quickPrompts.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendChatMessage(p.text)}
                          className="text-[10px] text-left p-1.5 rounded bg-[#13161d] border border-gold/10 hover:border-gold/30 text-muted-foreground hover:text-gold transition-colors inline-flex justify-between items-center pr-2 cursor-pointer font-medium"
                        >
                          <span className="truncate mr-2">✦ {p.label}</span>
                          <ArrowUpRight size={10} className="shrink-0 text-gold/60" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input action toolbar */}
                <div className="p-3 bg-secondary/15 border-t border-gold/10 flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                    placeholder="Ask about corporate compliance, tax filing code, Node deployments..."
                    className="flex-1 bg-secondary/35 border border-gold/15 focus:border-gold/40 rounded-lg px-3.5 py-2.5 text-xs text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-0 transition-colors"
                  />
                  <button
                    onClick={() => handleSendChatMessage()}
                    disabled={chatLoading || !chatInput.trim()}
                    className="p-2.5 bg-gold-gradient text-primary-foreground rounded-lg hover:opacity-90 active:scale-95 disabled:opacity-5 w-10 h-10 flex items-center justify-center shrink-0 duration-150 transition-all cursor-pointer shadow shadow-gold/15"
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>
            ) : (
              /* TAB 2: BLUEPRINT AUTO CONTRACT DRAPER */
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {!draftResult ? (
                  <form onSubmit={handleCreateDraft} className="space-y-4 animate-fade-in text-xs">
                    <div className="bg-gold/5 border border-gold/15 p-3 rounded-lg text-[11px] text-muted-foreground leading-normal flex items-start gap-1.5">
                      <Scale size={13} className="text-gold shrink-0 mt-0.5 animate-pulse" />
                      <span>Input contract goals to draft legal frameworks directly aligned with standard Indian and Global compliance.</span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-[#939fab] mb-1 font-semibold">Contract Style Type</label>
                      <select
                        value={contractType}
                        onChange={(e) => setContractType(e.target.value)}
                        className="w-full bg-[#11141b] border border-gold/15 focus:border-gold/40 rounded-lg px-3.5 py-2.5 font-body text-foreground focus:outline-none cursor-pointer"
                      >
                        <option value="Mutual Non Disclosure Agreement">Mutual NDA (Agreements & NDA category)</option>
                        <option value="Memorandum of Understanding / MoU">Memorandum of Understanding (MoU)</option>
                        <option value="SaaS Service Level Agreement">SaaS Service Level Agreement (SLA)</option>
                        <option value="Independent Contractor Agreement">Independent Contractor Agreement</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-[#939fab] mb-1 font-semibold">Promoter / Party A <span className="text-gold">*</span></label>
                        <input
                          type="text"
                          required
                          value={partyA}
                          onChange={(e) => setPartyA(e.target.value)}
                          placeholder="First Party Name"
                          className="w-full bg-secondary/20 border border-gold/15 focus:border-gold/40 rounded-lg px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-[#939fab] mb-1 font-semibold">Witness / Party B</label>
                        <input
                          type="text"
                          required
                          value={partyB}
                          onChange={(e) => setPartyB(e.target.value)}
                          placeholder="Second Party Name"
                          className="w-full bg-secondary/20 border border-gold/15 focus:border-gold/40 rounded-lg px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-[#939fab] mb-1 font-semibold">Legal Jurisdiction</label>
                      <input
                        type="text"
                        value={jurisdiction}
                        onChange={(e) => setJurisdiction(e.target.value)}
                        placeholder="State / Local Jurisdiction"
                        className="w-full bg-secondary/20 border border-gold/15 focus:border-gold/40 rounded-lg px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-[#939fab] mb-1 font-semibold">Core Deal Deliverables & Scope <span className="text-gold">*</span></label>
                      <textarea
                        rows={3}
                        required
                        value={mainDeal}
                        onChange={(e) => setMainDeal(e.target.value)}
                        placeholder="Detail payment conditions, timelines, or Intellectual Property transfer targets..."
                        className="w-full bg-secondary/20 border border-gold/15 focus:border-gold/50 rounded-lg px-3.5 py-2.5 text-xs font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={draftLoading}
                      className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-primary-foreground font-semibold text-xs uppercase tracking-widest py-3 rounded-lg hover:opacity-95 disabled:opacity-50 cursor-pointer shadow shadow-gold/15"
                    >
                      {draftLoading ? (
                        <>
                          <Loader2 size={12} className="shrink-0 animate-spin" />
                          Framing Legal Clauses...
                        </>
                      ) : (
                        <>
                          <FileText size={12} />
                          Generate Custom Contract Draft
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Drafting Outcome Presentation */
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-gold/10 pb-2.5 bg-secondary/5 rounded-t p-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">Compiled Legal Framework</span>
                      <button
                        onClick={() => setDraftResult('')}
                        className="text-[10px] text-muted-foreground hover:text-gold transition-colors font-mono uppercase"
                      >
                        ← Draft Another
                      </button>
                    </div>

                    <div className="bg-secondary/15 border border-gold/20 rounded-xl p-4 overflow-y-auto max-h-[380px] break-words relative scrollbar-thin">
                      {formatMarkdown(draftResult)}
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(draftResult);
                        toast({
                          title: "Copied to Clipboard!",
                          description: "Draft framework script was logged into your device copy buffer.",
                          type: "success"
                        });
                        playChime(true);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 bg-secondary/35 border border-gold/25 hover:border-gold/50 text-gold hover:text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                    >
                      <Check size={12} />
                      Copy Agreement Outline
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
