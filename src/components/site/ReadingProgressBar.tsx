import { useEffect, useState } from 'react';

interface SectionMarker {
  id: string;
  label: string;
  leftPercent: number;
}

export default function ReadingProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState('Home');
  const [markers, setMarkers] = useState<SectionMarker[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      
      const currentScroll = window.scrollY;
      const progress = (currentScroll / scrollHeight) * 100;
      setScrollProgress(Math.min(Math.max(progress, 0), 100));

      // Discover current active section
      const sections = ['home', 'about', 'services', 'portfolio', 'testimonials', 'faq', 'contact'];
      let active = 'Home';
      
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Sec covers middle of the screen
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4) {
            active = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
            break;
          }
        }
      }
      setCurrentSection(active);
    };

    // Calculate marker physical screen percents
    const updateMarkers = () => {
      const targetSections = [
        { id: 'services', label: 'Services' },
        { id: 'portfolio', label: 'Portfolio' }
      ];
      
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const newMarkers = targetSections.map(sec => {
        const el = document.getElementById(sec.id);
        if (!el) return null;
        const rectTop = el.offsetTop;
        const percent = (rectTop / scrollHeight) * 100;
        return {
          id: sec.id,
          label: sec.label,
          leftPercent: Math.min(Math.max(percent, 0), 98) // keep within bounds
        };
      }).filter(Boolean) as SectionMarker[];

      setMarkers(newMarkers);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateMarkers, { passive: true });
    
    // Defer offset calculation until render frames stabilize
    const timer = setTimeout(() => {
      handleScroll();
      updateMarkers();
    }, 800);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateMarkers);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-[3px] bg-secondary/30 z-[9999] pointer-events-none select-none"
      id="reading-progress-container"
    >
      {/* Scroll indicator glow bar */}
      <div 
        className="h-full bg-gold-gradient relative transition-all duration-75 ease-out shadow-[0_1px_8px_rgba(197,160,89,0.5)]"
        style={{ width: `${scrollProgress}%` }}
      >
        <span className="absolute right-0 top-0 h-full w-[20px] bg-white/40 blur-sm animate-pulse" />
      </div>

      {/* Floating active section indicator bubble to the right side if scrolling */}
      {scrollProgress > 1 && (
        <div 
          className="absolute right-4 top-4 px-2 py-1 glass-dark border border-gold/15 rounded text-[8px] font-mono uppercase tracking-widest text-gold shadow-md pointer-events-auto select-none transition-all duration-300 transform translate-y-0"
        >
          {currentSection}
        </div>
      )}

      {/* Markers for Services and Portfolio as requested */}
      {markers.map(marker => {
        const isPassed = scrollProgress >= marker.leftPercent;
        return (
          <div
            key={marker.id}
            className="absolute top-0 h-3 transform -translate-y-[4px] pointer-events-auto group hidden sm:block"
            style={{ left: `${marker.leftPercent}%` }}
          >
            {/* Visual Dot */}
            <div 
              className={`w-[6px] h-[6px] rounded-full transition-all duration-300 ${
                isPassed 
                  ? 'bg-gold shadow-[0_0_6px_rgba(197,160,89,0.8)] border border-white/20' 
                  : 'bg-muted-foreground/40 hover:bg-gold/60 border border-transparent'
              }`}
            />
            {/* Minimalist tooltip */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-background border border-gold/15 px-2 py-0.5 rounded text-[8px] font-mono text-muted-foreground whitespace-nowrap shadow uppercase tracking-wide">
                {marker.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
