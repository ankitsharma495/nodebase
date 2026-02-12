import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function LoginPage() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  const handleLinkedInLogin = () => {
    window.location.href = `${API_BASE}/auth/linkedin`;
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-sm text-center">
        {/* Logo */}
        <div className="mb-10 animate-fade-in-up">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white glow-effect">
            <span className="material-symbols-outlined text-4xl">bolt</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">
            Flowbase
          </h1>
          <p className="mt-2 text-sm text-slate-400 font-medium">
            AI-Powered Growth OS for LinkedIn Creators
          </p>
        </div>

        {/* Login Card */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <p className="mb-6 text-slate-400 text-sm">
            Analyze your content, get a growth score, and build a personalized 7-day growth plan.
          </p>

          <button
            onClick={handleLinkedInLogin}
            className="flex w-full items-center justify-center gap-3 rounded-[0.75rem] bg-[#0A66C2] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/50 focus:ring-offset-2 focus:ring-offset-surface-900 shadow-[0_0_20px_-6px_rgba(10,102,194,0.4)]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Sign in with LinkedIn
          </button>

          <div className="mt-5 flex items-center justify-center gap-2 text-slate-500 text-xs">
            <span className="material-symbols-outlined text-sm">lock</span>
            We only read your public profile
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {[
            { icon: 'insights', label: 'AI Analysis' },
            { icon: 'trending_up', label: 'Growth Score' },
            { icon: 'calendar_month', label: '7-Day Plan' },
          ].map((f) => (
            <div key={f.icon} className="flex flex-col items-center gap-2 rounded-[0.75rem] border border-white/[0.06] bg-white/[0.02] p-3">
              <span className="material-symbols-outlined text-primary text-xl">{f.icon}</span>
              <span className="text-xs text-slate-400 font-medium">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
