import { useState, useEffect, FormEvent } from 'react';
import { Loader2, Send, Sparkles, CheckCircle2, ChevronRight, Scale, Globe, FileText, TrendingUp, HelpCircle } from 'lucide-react';
import { useToast } from '../ui/toast';
import { apiService } from '../../lib/api';
import { Service } from '../../types';

interface ContactFormProps {
  onSuccess?: () => void;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form states matching user request fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('');
  const [message, setMessage] = useState('');
  const [refining, setRefining] = useState(false);

  const handleAIRefine = async () => {
    if (!message.trim()) return;
    setRefining(true);
    try {
      const refinedText = await apiService.refineBriefWithAI(message, inquiryType);
      setMessage(refinedText);
      toast({
        title: "Brief Amplified!",
        description: "Your brief was securely refined into an expert-ready specifications layout.",
        type: "success"
      });
      // Sound chime
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          gain.gain.setValueAtTime(0.03, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.2);
        }
      } catch(_) {}
    } catch (err) {
      console.warn(err);
      toast({
        title: "Intelligence Hub Alert",
        description: "Unable to complete brief polishing. Standard network issue or session timeout.",
        type: "error"
      });
    } finally {
      setRefining(false);
    }
  };

  useEffect(() => {
    // Dynamic services query to keep lists in sync
    apiService.getServices()
      .then((data) => {
        setServices(data);
      })
      .catch((err) => {
        console.error("Unable to list backend services for inquiries:", err);
      });
  }, []);

  // Helper utility to dynamically associate matching icons with known categories
  const getCategoryIcon = (title: string) => {
    const lTitle = title.toLowerCase();
    if (lTitle.includes('legal') || lTitle.includes('bylaw')) return <Scale size={13} className="text-gold" />;
    if (lTitle.includes('web') || lTitle.includes('portal') || lTitle.includes('architect')) return <Globe size={13} className="text-gold" />;
    if (lTitle.includes('draft') || lTitle.includes('contract') || lTitle.includes('nda')) return <FileText size={13} className="text-gold" />;
    if (lTitle.includes('seo') || lTitle.includes('marketing') || lTitle.includes('rank')) return <TrendingUp size={13} className="text-gold" />;
    return <HelpCircle size={13} className="text-gold" />;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast({
        title: "Validation Check",
        description: "Please populate your name and email parameters to connect.",
        type: "error"
      });
      return;
    }

    setLoading(true);

    try {
      // Prepared data shape integrating node with the admin notification alert system
      const preparedPayload = {
        name: name.trim(),
        email: email.trim(),
        service: inquiryType || "General Inquiry",
        message: message.trim() || `Client requested informational query about: ${inquiryType || "General Services"}`
      };

      await apiService.addInquiry(preparedPayload);
      
      // Play a lovely high-frequency custom tone chime securely on submission
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
        }
      } catch(_) {}

      setSubmitted(true);
      toast({
        title: "Inquiry Transmission Secure",
        description: "Your briefing lead has been committed of-record to our server alerts stream.",
        type: "success"
      });

      // Clear the local state inputs
      setName('');
      setEmail('');
      setInquiryType('');
      setMessage('');

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Ingress Failed",
        description: "Submission encountered an interface block. Please try again.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-secondary/10 border border-gold/15 rounded-xl p-8 text-center space-y-5 animate-fade-in relative overflow-hidden">
        {/* Decorative corner flash */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full blur-2xl" />
        
        <div className="w-14 h-14 bg-gold/15 rounded-full flex items-center justify-center text-gold mx-auto border border-gold/25 shadow-md">
          <CheckCircle2 size={24} className="animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold text-gold-shimmer font-semibold">Transmission Successful</span>
          <h4 className="font-display text-2xl text-foreground font-light">Inquiry Ingress Complete</h4>
          <p className="font-body text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            Thank you for reaching out. Your consulting profile credentials, selected inquiry type, and brief have been compiled and sent straight to AJSi Admin Notification Channels.
          </p>
        </div>

        <button
          onClick={() => setSubmitted(false)}
          className="px-5 py-2.5 bg-gold/10 hover:bg-gold/20 border border-gold/25 rounded-md text-gold text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer inline-flex items-center gap-1.5"
        >
          Submit Another Request <ChevronRight size={13} />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-dark border border-gold/15 rounded-xl p-8 space-y-6 relative overflow-hidden">
      {/* Dynamic top gradient ribbon */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-gold/80 to-transparent" />
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground font-mono mb-2 flex items-center gap-1">
            <span>01.</span> Full Name <span className="text-gold font-bold">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Elena Rostova"
            className="w-full bg-secondary/20 border border-gold/15 focus:border-gold/50 rounded-lg px-4 py-3 text-xs font-body text-foreground placeholder-muted-foreground/50 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground font-mono mb-2 flex items-center gap-1">
            <span>02.</span> Email Endpoint <span className="text-gold font-bold">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. elena@finance.com"
            className="w-full bg-secondary/20 border border-gold/15 focus:border-gold/50 rounded-lg px-4 py-3 text-xs font-body text-foreground placeholder-muted-foreground/50 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground font-mono mb-2 flex items-center gap-1">
            <span>03.</span> Select Inquiry Type <span className="text-gold font-bold">*</span>
          </label>
          
          {/* Quick Choice Pills Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {services.slice(0, 4).map((serv) => (
              <button
                key={serv.id}
                type="button"
                onClick={() => setInquiryType(serv.title)}
                className={`py-2 px-3 rounded-lg border text-[10px] font-semibold flex items-center gap-1.5 transition-all text-left cursor-pointer ${
                  inquiryType === serv.title
                    ? 'bg-gold/15 border-gold/50 text-gold'
                    : 'bg-secondary/15 border-gold/10 text-muted-foreground hover:border-gold/30 hover:text-foreground'
                }`}
              >
                {getCategoryIcon(serv.title)}
                <span className="truncate">{serv.title}</span>
              </button>
            ))}
          </div>

          <div className="relative">
            <select
              value={inquiryType}
              required
              onChange={(e) => setInquiryType(e.target.value)}
              className="w-full bg-[#11141b] border border-gold/15 focus:border-gold/50 rounded-lg px-4 py-3 text-xs font-body text-foreground focus:outline-none transition-all cursor-pointer"
            >
              <option value="">Select or search inquiry type...</option>
              {services.map((item) => (
                <option key={item.id} value={item.title}>
                  {item.title}
                </option>
              ))}
              <option value="General Corporate Support">General Corporate Support</option>
              <option value="Aegis Portal Clearance">Aegis Portal Clearance </option>
              <option value="SaaS Contract Drafting Request">SaaS Contract Drafting Request</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground font-mono mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1"><span>04.</span> Inquiry Details & Brief</span>
            {message.trim().length >= 8 && (
              <button
                type="button"
                onClick={handleAIRefine}
                disabled={refining}
                className="text-[10px] text-gold hover:text-foreground bg-gold/5 hover:bg-gold/15 border border-gold/15 hover:border-gold/30 rounded-md px-2 py-0.5 font-sans font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Elevate this raw message with ASJi AI Advisor"
              >
                {refining ? (
                  <>
                    <Loader2 size={10} className="animate-spin" />
                    <span>Polishing Brief...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={10} className="text-gold animate-pulse" />
                    <span>AI Refine Brief</span>
                  </>
                )}
              </button>
            )}
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about your organization parameters or legal/web milestones..."
            className="w-full bg-secondary/20 border border-gold/15 focus:border-gold/50 rounded-lg px-4 py-3 text-xs font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-all resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-primary-foreground font-body text-xs font-bold uppercase tracking-widest py-3.5 rounded-lg hover:opacity-90 active:scale-[0.99] transition-all duration-150 disabled:opacity-50 cursor-pointer shadow-md shadow-gold/15"
      >
        {loading ? (
          <>
            <Loader2 size={13} className="animate-spin" />
            Transmitting Node Ingress...
          </>
        ) : (
          <>
            <Send size={12} />
            Transmit Ingress Notification
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-[9px] font-mono text-muted-foreground/60 text-center">
        <Sparkles size={10} className="text-gold" />
        Real-time admin alert terminal channel synchronized.
      </div>
    </form>
  );
}
