import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center text-foreground relative overflow-hidden">
      {/* Glow background anchor */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, hsl(42 80% 52% / 0.03) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-md w-full glass-dark border border-gold/15 rounded-xl p-8 shadow-gold">
        <h1 className="font-display text-8xl font-light text-gold-gradient mb-2">404</h1>
        <h2 className="font-display text-2xl font-light text-foreground mb-4">Page Not Found</h2>
        <p className="font-body text-sm text-muted-foreground leading-6 mb-8">
          The legal or web solution you are looking for does not exist or has been relocated. Let's get you back on track.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-gold-gradient text-primary-foreground font-body text-xs font-semibold uppercase tracking-widest px-6 py-4 rounded hover:opacity-95 transition-opacity duration-300 shadow-gold"
        >
          <ArrowLeft size={14} />
          Back to Home
        </a>
      </div>
    </div>
  );
}
