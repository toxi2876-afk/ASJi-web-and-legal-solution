import { useEffect, useRef } from 'react';
import { Scale, Eye, Lightbulb, Handshake } from 'lucide-react';

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
      </div>

      {/* Bottom Border Accent */}
      <div className="absolute left-0 bottom-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
}
