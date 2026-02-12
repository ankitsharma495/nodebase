import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import AnalysisPage from './pages/AnalysisPage';
import AnalysisDetail from './pages/AnalysisDetail';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-900">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analyze"
          element={
            <ProtectedRoute>
              <AnalysisPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis/:id"
          element={
            <ProtectedRoute>
              <AnalysisDetail />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
