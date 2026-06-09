import { useEffect, useRef, useState, FormEvent } from 'react';
import { Mail, Phone, MapPin, Loader2, Instagram, Linkedin } from 'lucide-react';
import { useToast } from '../ui/toast';
import { Service } from '../../types';
import { apiService } from '../../lib/api';

const contactInfo = [
  { icon: Mail, label: "Email", value: "axbz.0626@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 94615 84298" },
  { icon: MapPin, label: "Location", value: "Jaipur, Rajasthan, India" }
];

export default function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Dynamic services fetch to populate selection options
    apiService.getServices()
      .then((data) => {
        setServices(data);
      })
      .catch((err) => {
        console.error('Failed to get services for contact form:', err);
      });

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
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields.",
        type: "error"
      });
      return;
    }

    setLoading(true);

    try {
      await apiService.addInquiry(formData);
      setFormData({ name: "", email: "", service: "", message: "" });
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
        type: "success"
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Background radial gold glow alignment */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, hsl(42 80% 52% / 0.05) 0%, transparent 60%)',
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="font-body text-xs uppercase tracking-widest text-gold mb-3 reveal section-hidden">
            Get In Touch
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light text-foreground reveal section-hidden" style={{ transitionDelay: "0.1s" }}>
            Let's <span className="text-gold-gradient">Connect</span>
          </h2>
          <div className="w-16 h-px bg-gold-gradient mx-auto mt-4 reveal section-hidden" style={{ transitionDelay: "0.2s" }} />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Details Column */}
          <div className="space-y-8 reveal section-hidden" style={{ transitionDelay: "0.15s" }}>
            <div>
              <h3 className="font-display text-3xl font-light text-foreground mb-4">Start Your Journey</h3>
              <p className="font-body text-sm text-muted-foreground leading-7">
                Whether you need a cutting-edge web presence, clear legal documentation, corporate counsel, or marketing growth, we are here to deliver exceptional results. Fill out the form or reach out to us directly.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info) => {
                const IconComponent = info.icon;
                return (
                  <div key={info.label} className="glass-dark border border-gold/10 rounded-xl p-5 flex items-start gap-4 card-3d">
                    <div className="w-11 h-11 rounded-lg bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                      <IconComponent size={18} />
                    </div>
                    <div>
                      <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">{info.label}</p>
                      <p className="font-display text-base text-foreground mt-1">{info.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social channels segment */}
            <div className="pt-6 border-t border-gold/10">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-3">Connect With Us</p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/in/arush-sharma-369318332?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-gold/15 bg-secondary/30 hover:border-gold/50 hover:bg-gold/5 text-xs text-muted-foreground hover:text-gold transition-all duration-300 cursor-pointer"
                  title="Arush Sharma - LinkedIn"
                >
                  <Linkedin size={14} className="text-gold" />
                  <span className="font-body font-medium">LinkedIn</span>
                </a>
                <a
                  href="https://www.instagram.com/asjiweblegal?igsh=dTV6dXN0cTE1MWww"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-gold/15 bg-secondary/30 hover:border-gold/50 hover:bg-gold/5 text-xs text-muted-foreground hover:text-gold transition-all duration-300 cursor-pointer"
                  title="ASJi Web & Legal Solutions - Instagram"
                >
                  <Instagram size={14} className="text-gold" />
                  <span className="font-body font-medium">Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Inquiry Form Column */}
          <div className="reveal section-hidden" style={{ transitionDelay: "0.25s" }}>
            <form onSubmit={handleSubmit} className="glass-dark border border-gold/15 rounded-xl p-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground font-body mb-2">
                    Name <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full bg-secondary/30 border border-gold/15 rounded px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground font-body mb-2">
                    Email <span className="text-gold">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Your email"
                    className="w-full bg-secondary/30 border border-gold/15 rounded px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground font-body mb-2">
                  Requested Service
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData((prev) => ({ ...prev, service: e.target.value }))}
                  className="w-full bg-[#141820] border border-gold/15 rounded px-4 py-3 text-sm font-body text-foreground select-dark focus:outline-none focus:border-gold/50 transition-colors cursor-pointer"
                >
                  <option value="">Select a service...</option>
                  {services.map((item) => (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                  <option value="General inquiry">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground font-body mb-2">
                  Message <span className="text-gold">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us about your project/needs..."
                  className="w-full bg-secondary/30 border border-gold/15 rounded px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-primary-foreground font-body text-xs font-semibold uppercase tracking-widest py-4 rounded hover:opacity-95 transition-opacity duration-300 disabled:opacity-50 cursor-pointer shadow-gold"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
