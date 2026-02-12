import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAnalyses } from '../lib/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getAnalyses();
        setAnalyses(data.data.analyses || []);
      } catch (err) {
        console.error('Failed to fetch analyses:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const latestAnalysis = analyses[0] || null;

  const stats = [
    { label: 'Growth Score', value: latestAnalysis?.growthScore ?? '—', icon: 'speed', color: 'primary' },
    { label: 'Niche', value: latestAnalysis?.detectedNiche || '—', icon: 'trending_up', color: 'emerald', isText: true },
    { label: 'Analyses', value: analyses.length, icon: 'analytics', color: 'violet' },
    { label: 'Status', value: 'Active', icon: 'bolt', color: 'amber', isStatus: true },
  ];

  const colorMap = {
    primary: 'bg-primary/10 text-primary',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    violet: 'bg-violet-500/10 text-violet-400',
    amber: 'bg-amber-500/10 text-amber-400',
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Welcome back, {user?.name?.split(' ')[0] || 'Creator'}{' '}
          <span className="inline-block animate-pulse-slow">👋</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">Your LinkedIn Growth Operating System</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorMap[s.color]}`}>
              <span className="material-symbols-outlined text-xl">{s.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">{s.label}</p>
              {s.isStatus ? (
                <p className="text-base font-semibold text-emerald-400">Active</p>
              ) : s.isText ? (
                <p className="truncate text-base font-semibold">{s.value}</p>
              ) : (
                <p className="text-2xl font-bold tracking-tight">{s.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] to-violet-600/[0.06] p-6">
        {/* Subtle glow */}
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-lg font-semibold">Run a New Analysis</h2>
            <p className="mt-1 text-sm text-slate-400">
              Paste your last 5 LinkedIn posts for AI-powered insights, a growth score, and a 7-day plan.
            </p>
          </div>
          <Link to="/analyze" className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <span className="material-symbols-outlined text-lg">insights</span>
            Analyze Posts
          </Link>
        </div>
      </div>

      {/* Past Analyses */}
      <div>
        <h2 className="mb-4 font-display text-base font-semibold tracking-tight">Past Analyses</h2>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : analyses.length === 0 ? (
          <div className="card py-16 text-center">
            <span className="material-symbols-outlined mb-3 text-4xl text-slate-700">science</span>
            <p className="text-sm text-slate-500">No analyses yet. Run your first one!</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {analyses.map((a) => (
              <Link
                key={a.id}
                to={`/analysis/${a.id}`}
                className="card group flex items-center justify-between transition-all hover:border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                    {a.growthScore ?? '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{a.detectedNiche || 'Analysis'}</p>
                    <p className="text-xs text-slate-600">
                      {new Date(a.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-lg text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-400">
                  arrow_forward
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
