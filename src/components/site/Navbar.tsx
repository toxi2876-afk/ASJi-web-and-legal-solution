import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (selector: string) => {
    setIsOpen(false);
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "glass-dark shadow-gold py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* LOGO LINK */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleScrollTo("#home");
          }}
          className="flex items-center gap-3"
        >
          <div className="relative group/logo flex items-center justify-center">
            <div className="absolute -inset-1 bg-gradient-to-r from-gold via-gold-hover to-[#aa7c11] rounded-full blur-sm opacity-50 group-hover/logo:opacity-100 transition-opacity duration-300 animate-spin-slow" style={{ animationDuration: '6s' }} />
            <img
              src="https://grazia-prod.oss-ap-southeast-1.aliyuncs.com/resources/uid_100077177/e96c9d96-e1de-48.png"
              alt="ASJi Logo"
              className="relative w-10 h-10 rounded-full object-cover border border-gold/30 transition-transform duration-300 group-hover/logo:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-display text-2xl font-semibold text-gold-gradient hidden sm:block tracking-wide">
            ASJi
          </span>
        </a>

        {/* desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <button
                onClick={() => handleScrollTo(link.href)}
                className="font-body text-sm text-foreground/70 hover:text-gold transition-colors duration-300 tracking-wide uppercase cursor-pointer"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* mobile menu icon */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-foreground cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV DROPDOWN */}
      {isOpen && (
        <div className="md:hidden glass-dark border-t border-gold/10 mt-2 py-4 px-6 space-y-4">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleScrollTo(link.href)}
              className="block w-full text-left font-body text-sm text-foreground/70 hover:text-gold transition-colors uppercase tracking-wide py-2 cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
