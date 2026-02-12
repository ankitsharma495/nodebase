import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const statuses = [
  'AI is crafting your growth strategy...',
  'Analyzing profile engagement...',
  'Building your personalized roadmap...',
  'Fetching latest industry benchmarks...',
  'Finalizing your dashboard setup...',
];

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [statusIdx, setStatusIdx] = useState(0);
  const [progress, setProgress] = useState(15);

  // Cycle status messages
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIdx((i) => (i + 1) % statuses.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Animate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p < 92 ? p + Math.random() * 8 : p));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Handle auth
  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      navigate('/login?error=' + error);
      return;
    }

    if (token) {
      login(token);
      const timer = setTimeout(() => navigate('/dashboard', { replace: true }), 2200);
      return () => clearTimeout(timer);
    } else {
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
        {/* Spinner + Icon */}
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse-slow" />
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* Spinning ring */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" style={{ animationDuration: '1.2s', animationTimingFunction: 'cubic-bezier(0.5,0,0.5,1)' }} />
            {/* Icon */}
            <div className="bg-primary h-14 w-14 rounded-2xl flex items-center justify-center text-white glow-effect z-10">
              <span className="material-symbols-outlined text-3xl font-bold">bolt</span>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-4 animate-fade-in-up">
          <h1 className="text-2xl font-display font-semibold tracking-tight text-white">
            Syncing with LinkedIn
          </h1>
          <p className="text-slate-400 font-medium text-sm transition-opacity duration-500">
            {statuses[statusIdx]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-10 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-700 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Footer badge */}
        <div className="mt-20 animate-fade-in-up flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-widest" style={{ animationDelay: '0.2s' }}>
          <span className="material-symbols-outlined text-sm">lock</span>
          Secure encrypted connection
        </div>
      </main>
    </div>
  );
}
