import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnalysisById } from '../lib/api';

export default function AnalysisDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await getAnalysisById(id);
        setData(res.data.data.analysis);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analysis.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 text-center">
        <span className="material-symbols-outlined mb-3 text-4xl text-red-400/60">error</span>
        <p className="text-sm text-red-400">{error}</p>
        <Link to="/" className="btn-secondary mt-4 inline-flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">home</span>
          Go Home
        </Link>
      </div>
    );
  }

  const analysis = data?.fullAnalysis || {};
  const score = data?.growthScore || {};
  const plan = data?.growthPlan || {};

  const analysisCards = [
    { icon: 'groups', title: 'Target Audience', color: 'text-primary', content: <p className="text-sm text-slate-400">{analysis.target_audience}</p> },
    {
      icon: 'record_voice_over', title: 'Tone Analysis', color: 'text-violet-400',
      content: (
        <div className="space-y-1 text-sm text-slate-400">
          <p><span className="text-slate-600">Primary:</span> {analysis.tone_analysis?.primary_tone}</p>
          <p><span className="text-slate-600">Secondary:</span> {analysis.tone_analysis?.secondary_tone}</p>
          <p><span className="text-slate-600">Consistency:</span> {analysis.tone_analysis?.consistency}</p>
        </div>
      ),
    },
    {
      icon: 'trending_up', title: 'Content Strengths', color: 'text-emerald-400',
      content: (
        <ul className="space-y-2">
          {(analysis.content_strengths || []).map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
              <span className="material-symbols-outlined mt-0.5 text-base flex-shrink-0 text-emerald-500">check_circle</span>
              {s}
            </li>
          ))}
        </ul>
      ),
    },
    {
      icon: 'warning', title: 'Content Gaps', color: 'text-amber-400',
      content: (
        <ul className="space-y-2">
          {(analysis.content_gaps || []).map((g, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
              <span className="material-symbols-outlined mt-0.5 text-base flex-shrink-0 text-amber-500">target</span>
              {g}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-slate-500 transition-all hover:bg-white/[0.08] hover:text-white">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">{analysis.detected_niche || 'Content Analysis'}</h1>
          <p className="text-xs text-slate-600">
            {new Date(data?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Growth Score */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.06] to-emerald-600/[0.04] p-6">
        <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <h2 className="mb-4 font-display text-base font-semibold">Growth Score</h2>
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          {/* Score ring */}
          <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
              <circle cx="48" cy="48" r="42" fill="none" stroke="#5551FF" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${((score.total || 0) / 100) * 264} 264`} />
            </svg>
            <span className="text-3xl font-bold tracking-tight">{score.total ?? '—'}</span>
          </div>

          {/* Breakdown */}
          <div className="grid flex-1 gap-2.5 sm:grid-cols-2">
            {score.breakdown &&
              Object.entries(score.breakdown).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-2.5">
                  <span className="text-xs capitalize text-slate-500">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-12 overflow-hidden rounded-full bg-white/[0.06]">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(val.score / val.maxScore) * 100}%` }} />
                    </div>
                    <span className="text-xs font-semibold tabular-nums">
                      {val.score}/{val.maxScore}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Profile Analysis Grid */}
      <div className="grid gap-3 md:grid-cols-2">
        {analysisCards.map((c) => (
          <div key={c.title} className="card">
            <div className={`mb-3 flex items-center gap-2 ${c.color}`}>
              <span className="material-symbols-outlined text-lg">{c.icon}</span>
              <h3 className="text-sm font-semibold">{c.title}</h3>
            </div>
            {c.content}
          </div>
        ))}
      </div>

      {/* Growth Opportunities */}
      <div className="card">
        <div className="mb-3 flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-lg">lightbulb</span>
          <h3 className="text-sm font-semibold">Growth Opportunities</h3>
        </div>
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {(analysis.growth_opportunities || []).map((o, i) => (
            <li key={i} className="flex items-start gap-2.5 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 text-sm text-slate-400">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                {i + 1}
              </span>
              {o}
            </li>
          ))}
        </ul>
      </div>

      {/* 7-Day Growth Plan */}
      <div>
        <div className="mb-4 flex items-center gap-2.5">
          <span className="material-symbols-outlined text-2xl text-violet-400">calendar_month</span>
          <h2 className="font-display text-xl font-semibold tracking-tight">7-Day Growth Plan</h2>
        </div>
        {plan.plan_summary && (
          <p className="mb-4 text-sm text-slate-500">{plan.plan_summary}</p>
        )}

        <div className="space-y-3">
          {(plan.days || []).map((day) => (
            <details key={day.day} className="card group cursor-pointer transition-all hover:border-white/10">
              <summary className="flex items-center justify-between text-sm font-medium">
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/15 text-xs font-bold text-violet-400">
                    {day.day}
                  </span>
                  Day {day.day}: {day.theme}
                </span>
                <span className="material-symbols-outlined text-lg text-slate-600 transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </summary>

              <div className="mt-4 space-y-3 border-t border-white/[0.04] pt-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">Post Idea</p>
                  <p className="mt-1 text-sm text-slate-400">{day.post_idea}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">Hook</p>
                  <p className="mt-1 text-sm font-medium text-primary">"{day.hook}"</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">Suggested CTA</p>
                    <p className="mt-1 text-sm text-slate-400">{day.suggested_cta}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">Engagement Task</p>
                    <p className="mt-1 text-sm text-slate-400">{day.engagement_task}</p>
                  </div>
                </div>
                {(day.best_posting_time || day.content_format) && (
                  <div className="flex gap-4 text-xs text-slate-600">
                    {day.best_posting_time && <span>⏰ {day.best_posting_time}</span>}
                    {day.content_format && <span>📝 {day.content_format}</span>}
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
