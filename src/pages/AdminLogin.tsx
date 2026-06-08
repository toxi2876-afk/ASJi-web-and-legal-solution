import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, User, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../components/ui/toast';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    if (localStorage.getItem('asji_admin_token') === 'authenticated_session') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Direct local authentication or mock server response
      if (
        (username === 'admin' && password === 'admin') ||
        (username === 'admin' && password === 'adminasji') ||
        password === 'adminasji'
      ) {
        localStorage.setItem('asji_admin_token', 'authenticated_session');
        toast({
          title: "Welcome Back",
          description: "Logged in successfully to Admin Portal.",
          type: "success"
        });
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid credentials. Please try again.",
          type: "error"
        });
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground relative overflow-hidden font-body">
      {/* Upper golden glow orb */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 30%, hsl(42 80% 52% / 0.04) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Back Link */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold text-sm mb-6 transition-colors self-start"
        >
          <ArrowLeft size={14} />
          Back to Website
        </a>

        {/* Login Box */}
        <div className="glass-dark border border-gold/15 rounded-xl p-8 shadow-gold relative">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold mx-auto mb-4 border border-gold/20">
              <KeyRound size={22} />
            </div>
            <h1 className="font-display text-2xl text-foreground font-light mb-1">
              Portal <span className="text-gold">Authentication</span>
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
              ASJi Solutions Admin
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-secondary/30 border border-gold/15 rounded pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="adminasji"
                  className="w-full bg-secondary/30 border border-gold/15 rounded pl-10 pr-10 py-3 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-gradient text-primary-foreground font-semibold text-xs uppercase tracking-widest py-4 rounded hover:opacity-95 transition-opacity duration-300 disabled:opacity-50 cursor-pointer shadow-gold"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          {/* Prompt Credentials for easy access */}
          <div className="mt-6 pt-6 border-t border-gold/10 text-center">
            <p className="text-xs text-muted-foreground">
              Demo Credentials:{" "}
              <span className="text-gold font-mono">admin / adminasji</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
