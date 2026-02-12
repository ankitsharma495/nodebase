// ===========================================
// Auth Context - JWT-based auth state
// ===========================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('flowbase_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await getMe();
      setUser(data.data.user);
    } catch {
      localStorage.removeItem('flowbase_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = (token) => {
    localStorage.setItem('flowbase_token', token);
    fetchUser();
  };

  const logout = () => {
    localStorage.removeItem('flowbase_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
