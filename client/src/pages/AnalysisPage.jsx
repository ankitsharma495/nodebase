import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeProfile } from '../lib/api';

export default function AnalysisPage() {
  const [posts, setPosts] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (posts.trim().length < 50) {
      setError('Please paste at least 50 characters of LinkedIn post content.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await analyzeProfile(posts.trim());
      navigate(`/analysis/${data.data.analysisId}`);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Analysis failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: 'psychology', label: 'Profile Analysis', desc: 'Niche detection, audience insights, content strengths & gaps, tone analysis', color: 'text-primary' },
    { icon: 'speed', label: 'Growth Score', desc: '0-100 score based on consistency, niche clarity, CTA usage, engagement', color: 'text-emerald-400' },
    { icon: 'calendar_month', label: '7-Day Growth Plan', desc: 'Daily post ideas, hooks, CTAs, and engagement tasks personalized to your niche', color: 'text-violet-400' },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Analyze Your LinkedIn Content</h1>
        <p className="mt-1 text-sm text-slate-500">
          Paste your last 5 LinkedIn posts below. Our AI will analyze your content and generate personalized growth insights.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="card">
          <label htmlFor="posts" className="mb-2 block text-sm font-medium text-slate-300">
            Your LinkedIn Posts
          </label>
          <textarea
            id="posts"
            value={posts}
            onChange={(e) => setPosts(e.target.value)}
            rows={12}
            placeholder={`Paste your last 5 LinkedIn posts here...\n\nExample:\n\nPost 1:\nI just realized that most founders...\n\n---\n\nPost 2:\nHere's what 3 years of building taught me...`}
            className="input-field resize-y font-mono text-sm"
            disabled={loading}
          />
          <p className="mt-2 text-xs text-slate-600">
            Separate each post with a line break or "---". Minimum 50 characters.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-sm text-red-400">
            <span className="material-symbols-outlined text-lg flex-shrink-0">error</span>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || posts.trim().length < 50}
          className="btn-primary w-full"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              Analyzing... This may take 15-30 seconds
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              Analyze My Content
            </>
          )}
        </button>
      </form>

      {/* What You'll Get */}
      <div className="card">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-600">
          What You'll Get
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.label} className="space-y-1.5">
              <div className={`flex items-center gap-2 ${f.color}`}>
                <span className="material-symbols-outlined text-lg">{f.icon}</span>
                <p className="text-sm font-semibold">{f.label}</p>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
