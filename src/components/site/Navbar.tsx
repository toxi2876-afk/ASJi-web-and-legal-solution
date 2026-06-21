import { useEffect, useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    if (initialTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    
    // Play a premium soft high-frequency feedback chime
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(newTheme === 'light' ? 880 : 440, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch (_) {}
  };

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
        </a>

        {/* desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-4">
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

          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-gold/15 hover:border-gold/40 hover:bg-gold/5 text-gold transition-all duration-300 cursor-pointer flex items-center justify-center"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        {/* mobile menu icon */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="md:hidden p-2 rounded-lg border border-gold/15 hover:border-gold/30 hover:bg-gold/5 text-gold transition-all cursor-pointer flex items-center justify-center animate-fade-in"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button
            className="md:hidden text-foreground cursor-pointer p-1"
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
