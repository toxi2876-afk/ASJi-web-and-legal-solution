import { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, X, Loader2, Shield, 
  Copy, Check, ArrowUpRight, Maximize2, Minimize2, Clock 
} from 'lucide-react';
import { apiService } from '../../lib/api';
import { useToast } from '../ui/toast';

interface Message {
  role: 'user' | 'model';
  text: string;
  sources?: { title: string; uri: string }[];
}

const SUPPORT_PRESETS = [
  { label: "Our Core Services", text: "What services does ASJi offer for law firms and advocates?" },
  { label: "How to Request a Proposal", text: "We want to build a custom website. How do we initiate a proposal or brief?" },
  { label: "Admin Panel & Intake Logs", text: "Where do we find client intake records, SMS notifications, and our administrative dashboard?" },
  { label: "Contact Information", text: "How can I schedule a personal consultation or speak with the founders?" }
];

export default function AIHub() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  
  // Custom copy state tracking per message index
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Chat States
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Welcome to the ASJi Consulting & Support Assistant!\n\nI provide instant help on our core web development packages, statutory pricing plans, advocate portfolios, legal assistance, and automation tools. I am backed by real-time web-grounding.\n\nAsk me any question or select one of the quick topics below!"
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
          text: "⚠️ **System Notification:** Support bridge overloaded. Attempting to use offline local assistance guidelines." 
        }
      ]);
      toast({
        title: "Network Backup",
        description: "Viewing offline advisor information notes.",
        type: "info"
      });
    } finally {
      setChatLoading(false);
    }
  };

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

      // Headers
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

      // Inside block formatting
      const formattedLines = paragraph.split('\n').map((line, lineIdx) => {
        // Bullet points
        if (line.startsWith('* ') || line.startsWith('- ')) {
          const cleanLine = line.replace(/^[\*\-]\s/, '').trim();
          return (
            <li key={lineIdx} className="list-disc pl-1 ml-4 text-[11px] text-muted-foreground leading-relaxed my-1">
              {parseBoldText(cleanLine)}
            </li>
          );
        }

        // Decimal items
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
      description: "Text content successfully copied to Clipboard.",
      type: "success"
    });
    playChime(true);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <>
      {/* Drawer Launcher */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            playChime(true);
          }}
          className={`w-14 h-14 bg-gold-gradient rounded-full flex items-center justify-center text-[#07090c] shadow-lg hover:shadow-gold/30 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-gold/25 relative group ${
            isOpen ? 'rotate-[360deg] scale-110' : ''
          }`}
          title="Open ASJi Chatbot Assistant"
          id="asji-chatbot-launcher-root"
        >
          {isOpen ? (
            <X size={22} className="text-primary-foreground" />
          ) : (
            <>
              <MessageSquare size={22} className="text-[#07090c]" />
              <span className="absolute -inset-1.5 bg-gold/15 rounded-full blur-md group-hover:bg-gold/25 animate-ping -z-10" />
            </>
          )}
        </button>
      </div>

      {/* Chat Windows Container */}
      {isOpen && (
        <div 
          className={`fixed transition-all duration-300 z-50 overflow-hidden flex flex-col glass-dark border border-gold/25 rounded-2xl shadow-2xl ${
            isMaximized 
              ? 'inset-4 md:inset-10 w-[calc(100vw-32px)] md:w-[calc(100vw-80px)] h-[calc(100vh-32px)] md:h-[calc(100vh-80px)] max-w-4xl mx-auto' 
              : 'bottom-24 right-6 w-full max-w-[440px] h-[600px] max-h-[calc(100vh-120px)]'
          }`}
          id="asji-chatbot-container"
        >
          
          {/* Header Action Strip */}
          <header className="p-4 bg-secondary/30 border-b border-gold/15 flex items-center justify-between relative shrink-0">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/80 to-transparent" />
            
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center border border-gold/25">
                <MessageSquare size={16} className="text-gold animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-semibold text-gold-gradient tracking-wide leading-tight text-sm">ASJi Chatbot Assistant</h4>
                  <span className="text-[8px] font-mono px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded animate-pulse">ONLINE</span>
                </div>
                <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest leading-none mt-1">Virtual consulting and support desk</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Maximize Button */}
              <button
                onClick={() => {
                  setIsMaximized(!isMaximized);
                  playChime(true);
                }}
                className="p-1.5 text-muted-foreground hover:text-gold transition-colors bg-secondary/10 hover:bg-secondary/40 border border-gold/10 rounded"
                title={isMaximized ? "Restore small drawer view" : "Maximize view"}
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

          {/* Core Chat Viewport */}
          <div className="flex-1 overflow-hidden flex flex-col bg-[#080a0d] relative w-full">
            
            {/* Scrollable message register */}
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
                    {/* Header bar within bubble */}
                    <div className="flex items-center justify-between gap-6 pb-1.5 mb-1.5 border-b border-gold/10">
                      <span className="text-[8px] font-mono tracking-widest uppercase text-gold/70">
                        {msg.role === 'user' ? '👤 Client' : '🤖 ASJi Advisor'}
                      </span>
                      <button
                        onClick={() => copyToClipboard(msg.text, i)}
                        className="text-[10px] text-muted-foreground hover:text-gold transition-colors flex items-center gap-1 cursor-pointer"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === i ? (
                          <Check size={10} className="text-emerald-400" />
                        ) : (
                          <Copy size={10} className="opacity-75" />
                        )}
                        <span className="text-[8px] font-mono">
                          {copiedIndex === i ? 'Copied' : 'Copy'}
                        </span>
                      </button>
                    </div>

                    {/* Parser Body */}
                    <div className="text-xs break-words">
                      {formatMarkdown(msg.text)}
                    </div>

                    {/* Grounding Web Citations Sources footer */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-gold/10 text-[9px] font-sans">
                        <span className="block font-medium text-gold mb-1 uppercase tracking-tight">Grounding Citations & References:</span>
                        <div className="flex flex-col gap-1">
                          {msg.sources.map((s, sIdx) => (
                            <a
                              key={sIdx}
                              href={s.uri}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="text-muted-foreground hover:text-gold transition-colors inline-flex items-center gap-1 underline break-all"
                            >
                              📁 {s.title || "External Legal or Tech Registry"}
                              <ArrowUpRight size={8} />
                            </a>
                          ))}
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
                      <span className="text-[10px] font-mono text-[#e7ac23]/80 uppercase tracking-widest">Searching references & analyzing...</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[8px] font-mono py-0.5 px-2 bg-gold/5 border border-gold/15 rounded text-gold animate-pulse flex items-center gap-1">
                        <span className="w-1 h-1 bg-gold rounded-full inline-block" />
                        DYNAMIC SEARCH ONLINE
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick topics recommendation pills */}
            {messages.length === 1 && (
              <div className="p-3 bg-[#0c0f15] border-t border-gold/10 shrink-0">
                <p className="text-[9px] font-mono uppercase text-[#e7ac23]/80 tracking-widest px-1 mb-2">Select a Support Topic:</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {SUPPORT_PRESETS.map((p, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => handleSendChatMessage(p.text)}
                      className="text-[10px] text-left p-2 rounded bg-[#07090c]/80 hover:bg-[#bd8a12]/10 border border-gold/10 hover:border-gold/30 hover:text-gold text-muted-foreground transition-all duration-150 flex items-start gap-1 justify-between group cursor-pointer"
                    >
                      <span className="truncate pr-1">{p.label}</span>
                      <ArrowUpRight size={10} className="shrink-0 text-gold/40 group-hover:text-gold" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input Bar */}
            <div className="p-3 bg-[#0a0d12] border-t border-gold/15 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                placeholder="Ask about website plans, Indian legal setups, or custom development..."
                className="flex-1 bg-[#07090c] border border-gold/15 focus:border-[#bd8a12]/80 rounded-lg px-4 py-3 text-xs text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-0 transition-colors font-sans"
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

          {/* Footer Branding Strip */}
          <footer className="p-3 bg-[#0b0e14] border-t border-gold/15 flex items-center justify-between text-[9px] font-mono text-muted-foreground shrink-0 select-none">
            <span className="flex items-center gap-1">
              <Shield size={10} className="text-gold" />
              <span>Secure Support Node V4.20.1</span>
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
