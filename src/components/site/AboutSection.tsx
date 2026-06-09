import { useEffect, useRef } from 'react';
import { Scale, Eye, Lightbulb, Handshake, Instagram, Linkedin } from 'lucide-react';

const pillars = [
  {
    icon: Scale,
    title: "Client First",
    desc: "Every decision we make starts with one question — what's best for you? Your goals are our goals."
  },
  {
    icon: Eye,
    title: "Full Transparency",
    desc: "No hidden fees, no jargon. We communicate clearly and keep you informed at every step."
  },
  {
    icon: Lightbulb,
    title: "Fresh Thinking",
    desc: "We bring new perspectives and modern approaches to both legal and digital challenges."
  },
  {
    icon: Handshake,
    title: "Long-term Trust",
    desc: "We're not here for a one-time project. We're here to grow with you and be a reliable partner."
  }
];

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);

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
      { threshold: 0.15 }
    );

    const container = containerRef.current;
    if (container) {
      container.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Upper Border Accent */}
      <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-body text-xs uppercase tracking-widest text-gold mb-3 reveal section-hidden">
            About Us
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light text-foreground reveal section-hidden" style={{ transitionDelay: "0.1s" }}>
            Who We <span className="text-gold-gradient">Are</span>
          </h2>
          <div className="w-16 h-px bg-gold-gradient mx-auto mt-4 reveal section-hidden" style={{ transitionDelay: "0.2s" }} />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-6 reveal section-hidden" style={{ transitionDelay: '0.15s' }}>
            {/* The ASJi pillars card */}
            <div className="glass-dark border border-gold/15 rounded-lg p-8 card-3d">
              <p className="font-body text-xs uppercase tracking-widest text-gold mb-4">
                What ASJi Stands For
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { letter: 'A', word: 'Ambition', desc: 'We dream big for every client.' },
                  { letter: 'S', word: 'Strategy', desc: 'Every move is planned with purpose.' },
                  { letter: 'J', word: 'Justice', desc: 'We stand for fairness in all we do.' },
                  { letter: 'i', word: 'Innovation', desc: 'Modern solutions for modern challenges.' }
                ].map(({ letter, word, desc }) => (
                  <div key={letter} className="flex items-start gap-3">
                    <span className="font-display text-3xl text-gold leading-none mt-0.5">{letter}</span>
                    <div>
                      <p className="font-display text-base text-foreground">{word}</p>
                      <p className="font-body text-xs text-muted-foreground leading-4 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content box */}
            <div className="glass-dark rounded-lg p-6 border border-gold/10">
              <p className="font-display text-lg text-gold/90 italic mb-3 leading-relaxed">
                "Building businesses digitally. Protecting them legally."
              </p>
              <p className="font-body text-sm text-muted-foreground leading-7">
                ASJi Legal and Web Solutions was born from a simple belief — every business deserves both a strong digital identity and solid legal protection, regardless of its size or stage. We are a passionate, dedicated team at the start of an exciting journey, and we bring our absolute best to every single client.
              </p>
            </div>

            <p className="font-body text-sm text-muted-foreground leading-7">
              We may be fresh in the industry, but what we bring is 100% commitment, sharp focus, and a genuine drive to see our clients succeed. We combine knowledge in legal advisory, web development, document drafting, and digital marketing to offer you a complete solution under one roof.
            </p>

            <div className="flex flex-wrap gap-3">
              {["Honest", "Dedicated", "Client-Focused", "Innovative"].map((tag) => (
                <span key={tag} className="glass-gold text-gold text-xs font-body uppercase tracking-wider px-4 py-2 rounded-full border border-gold/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Pillars List */}
          <div className="grid grid-cols-1 gap-5 reveal section-hidden" style={{ transitionDelay: '0.25s' }}>
            {pillars.map((p, index) => {
              const IconComp = p.icon;
              return (
                <div
                  key={p.title}
                  className="glass-dark rounded-lg p-5 flex items-start gap-4 border border-gold/10 hover:border-gold/35 transition-all duration-300 group card-3d"
                  style={{ transitionDelay: `${0.08 * index}s` }}
                >
                  <div className="w-11 h-11 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-all">
                    <IconComp size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-foreground mb-1">{p.title}</h3>
                    <p className="font-body text-xs text-muted-foreground leading-5">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leadership Section */}
        <div className="mt-24 reveal section-hidden" style={{ transitionDelay: '0.3s' }}>
          <div className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-gold text-gold-shimmer font-semibold">Leadership Duo</span>
            <h2 className="font-display text-4xl text-foreground font-light mt-2 tracking-wide">Behind Our Vision</h2>
            <div className="w-16 h-0.5 bg-gold-gradient mx-auto mt-4" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {/* Arush Sharma - Founder & Principal */}
            <div className="lg:col-span-2 glass-dark border border-gold/25 rounded-2xl p-8 md:p-10 shadow-gold relative overflow-hidden group transition-all duration-300">
              {/* Ambient golden background gradients */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none group-hover:bg-gold/10 transition-all duration-700" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#aa7c11]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="grid md:grid-cols-3 gap-8 items-center relative z-10">
                {/* Founder Profile Visual */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-5">
                    {/* Elegant Golden Spinning Outer Ring */}
                    <div className="absolute -inset-2 border border-dashed border-gold/35 rounded-full animate-spin-slow pointer-events-none" style={{ animationDuration: '30s' }} />
                    <div className="absolute -inset-1 bg-gradient-to-r from-gold/50 via-gold-hover/30 to-[#aa7c11]/50 rounded-full blur opacity-60" />
                    
                    {/* Initials Placeholder / Stylish Silhouette */}
                    <div className="relative w-28 h-28 rounded-full bg-secondary border-2 border-gold/50 flex items-center justify-center shadow-lg overflow-hidden group-hover:border-gold transition-colors duration-500">
                      <span className="font-display text-3xl text-gold-gradient font-bold tracking-wider">AS</span>
                    </div>
                  </div>

                  <h3 className="font-display text-xl text-foreground font-semibold tracking-wide">ARUSH SHARMA</h3>
                  <p className="font-body text-[10px] text-gold uppercase tracking-widest mt-1">Founder & Principal</p>
                  <div className="w-10 h-px bg-gold-gradient mx-auto mt-2.5 mb-3.5" />

                  {/* Social profile links */}
                  <div className="flex items-center gap-3 justify-center">
                    <a
                      href="https://www.linkedin.com/in/arush-sharma-369318332?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full border border-gold/20 text-muted-foreground hover:text-gold hover:border-gold/60 hover:bg-gold/5 transition-all duration-300 cursor-pointer"
                      title="Arush Sharma - LinkedIn"
                    >
                      <Linkedin size={14} />
                    </a>
                    <a
                      href="https://www.instagram.com/asjiweblegal?igsh=dTV6dXN0cTE1MWww"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full border border-gold/20 text-muted-foreground hover:text-gold hover:border-gold/60 hover:bg-gold/5 transition-all duration-300 cursor-pointer"
                      title="ASJi Web & Legal Solutions - Instagram"
                    >
                      <Instagram size={14} />
                    </a>
                  </div>
                </div>

                {/* Founder's Vision statement */}
                <div className="md:col-span-2 space-y-3">
                  <span className="text-[10px] uppercase tracking-widest text-gold/80 font-body">Founder's Vision</span>
                  <h4 className="font-display text-2xl md:text-3xl text-foreground font-light leading-snug">
                    "Uniting absolute <span className="text-gold-gradient font-normal">legal defense</span> with robust, high-performance <span className="text-gold-gradient font-normal font-sans">web architecture</span>."
                  </h4>
                  <p className="font-body text-xs text-muted-foreground leading-6">
                    Under the leadership of <strong className="text-foreground">Arush Sharma</strong>, ASJi was established with a singular, powerful ambition: to bridge the gap between crucial legal compliance and digital growth. ARUSH SHARMA's vision drives our multi-disciplinary approach, ensuring our clients receive top-tier, modern websites and custom software solutions, fully backed by strategic legal advising, airtight document drafting, and targeted marketing campaigns.
                  </p>
                  <div className="flex items-center gap-4 pt-1.5 border-t border-gold/10">
                    <div>
                      <p className="font-display text-sm text-foreground font-medium">Arush Sharma</p>
                      <p className="font-body text-[10px] text-muted-foreground">Founder & Managing Director</p>
                    </div>
                    <div className="h-6 w-px bg-gold/20" />
                    <p className="font-body text-[10px] text-muted-foreground italic max-w-xs">
                      "Tailored litigation protection and rapid software scale for ambitious modern enterprises."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Saksham Sharma - Co-Founder */}
            <div className="lg:col-span-1 glass-dark border border-gold/20 hover:border-gold/40 rounded-2xl p-8 shadow-gold relative overflow-hidden group transition-all duration-300 flex flex-col justify-between">
              {/* Ambient golden background gradients */}
              <div className="absolute top-0 right-0 w-60 h-60 bg-gold/5 rounded-full blur-2xl pointer-events-none group-hover:bg-gold/8 transition-all duration-500" />
              
              <div className="relative z-10 flex flex-col items-center text-center my-auto">
                <div className="relative mb-5">
                  {/* Elegant Golden Spinning Outer Ring */}
                  <div className="absolute -inset-2 border border-dotted border-gold/25 rounded-full animate-spin-slow pointer-events-none" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
                  <div className="absolute -inset-1 bg-gradient-to-r from-gold/30 to-[#aa7c11]/30 rounded-full blur opacity-40" />
                  
                  {/* Monogram profile visual */}
                  <div className="relative w-28 h-28 rounded-full bg-secondary border-2 border-gold/30 flex items-center justify-center shadow-md overflow-hidden group-hover:border-gold/70 transition-colors duration-500">
                    <span className="font-display text-3xl text-gold-gradient font-bold tracking-wider">SS</span>
                  </div>
                </div>

                <h3 className="font-display text-xl text-foreground font-semibold tracking-wide">SAKSHAM SHARMA</h3>
                <p className="font-body text-[10px] text-gold uppercase tracking-widest mt-1">Co-Founder</p>
                <div className="w-10 h-px bg-gold-gradient mx-auto mt-2.5 mb-4" />

                <p className="font-body text-xs text-muted-foreground leading-6 px-2">
                  Partnering closely in driving ASJi forward. Saksham leverages corporate synergy and technical oversight, ensuring seamless coordination between elite web delivery and crucial regulatory counsel to support our partners' secure digital scale.
                </p>
              </div>

              {/* Quick links footer */}
              <div className="relative z-10 border-t border-gold/10 pt-4 mt-6 flex items-center justify-center gap-3">
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground/80 font-mono">Operations & Synergy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Border Accent */}
      <div className="absolute left-0 bottom-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
}
