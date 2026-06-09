import { Scale, Globe, FileText, TrendingUp, Instagram, Linkedin } from 'lucide-react';

const serviceLinks = [
  { icon: Scale, label: "Legal Consulting" },
  { icon: Globe, label: "Web Development" },
  { icon: FileText, label: "Document Drafting" },
  { icon: TrendingUp, label: "SEO & Marketing" }
];

export default function Footer() {
  const handleScrollTo = (selector: string) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-gold/15 bg-background z-10">
      {/* Top Border Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Logo Brand Statement Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://grazia-prod.oss-ap-southeast-1.aliyuncs.com/resources/uid_100077177/e96c9d96-e1de-48.png"
                alt="ASJi Logo"
                className="w-12 h-12 rounded-full object-cover border border-gold/30"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="font-display text-xl text-gold-gradient font-bold leading-tight">ASJi</p>
                <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mt-0.5">
                  Legal & Web Solutions
                </p>
              </div>
            </div>
            <p className="font-body text-sm text-muted-foreground leading-6 max-w-xs mb-5">
              Ambition · Strategy · Justice · Innovation — delivering our best work to help your business grow digitally and stay protected legally.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/arush-sharma-369318332?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-gold/15 flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 hover:bg-gold/5 transition-all duration-300 cursor-pointer"
                title="LinkedIn Profile"
              >
                <Linkedin size={14} />
              </a>
              <a
                href="https://www.instagram.com/asjiweblegal?igsh=dTV6dXN0cTE1MWww"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-gold/15 flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 hover:bg-gold/5 transition-all duration-300 cursor-pointer"
                title="Instagram Profile"
              >
                <Instagram size={14} />
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-body text-xs uppercase tracking-widest text-gold mb-5">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                ["Home", "#home"],
                ["About", "#about"],
                ["Services", "#services"],
                ["Portfolio", "#portfolio"],
                ["Contact", "#contact"]
              ].map(([label, href]) => (
                <li key={label}>
                  <button
                    onClick={() => handleScrollTo(href)}
                    className="font-body text-sm text-muted-foreground hover:text-gold transition-colors text-left cursor-pointer"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-body text-xs uppercase tracking-widest text-gold mb-5">
              Services
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map(({ icon: IconComponent, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <IconComponent size={13} className="text-gold/60 flex-shrink-0" />
                  <span className="font-body text-sm text-muted-foreground">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright segment */}
        <div className="border-t border-gold/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-body text-xs text-muted-foreground text-center sm:text-left flex items-center gap-2 justify-center sm:justify-start">
            <span>© {new Date().getFullYear()} ASJi Legal and Web Solutions. All rights reserved.</span>
          </div>
          <p className="font-body text-xs text-muted-foreground text-center sm:text-right italic">
            Building businesses digitally · Protecting them legally
          </p>
        </div>
      </div>
    </footer>
  );
}
