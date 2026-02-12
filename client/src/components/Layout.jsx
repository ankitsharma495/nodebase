import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Background glow — subtle and fixed */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[60%] h-[30%] bg-primary/30 blur-[140px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-surface-900/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white glow-sm">
              <span className="material-symbols-outlined text-lg">bolt</span>
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">Flowbase</span>
          </Link>

          <nav className="flex items-center gap-0.5">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                isActive('/dashboard') ? 'bg-white/[0.08] text-white' : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-lg">space_dashboard</span>
              Dashboard
            </Link>
            <Link
              to="/analyze"
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                isActive('/analyze') ? 'bg-white/[0.08] text-white' : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-lg">insights</span>
              Analyze
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user && (
              <>
                <div className="flex items-center gap-2">
                  {user.avatarUrl && (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-7 w-7 rounded-full border border-white/10"
                    />
                  )}
                  <span className="hidden text-sm font-medium text-slate-300 sm:inline">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-all hover:bg-white/[0.08] hover:text-white">
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-5 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} Flowbase. AI-Powered LinkedIn Growth OS.
      </footer>
    </div>
  );
}
