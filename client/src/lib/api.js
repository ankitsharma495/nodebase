// ===========================================
// API Client - Axios instance with auth
// ===========================================

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('flowbase_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally (skip redirect for /auth/me to avoid loops)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      // Don't redirect on the initial auth check — let AuthContext handle it
      if (!url.includes('/auth/me')) {
        localStorage.removeItem('flowbase_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ===========================================
// API Functions
// ===========================================

/** Get current user profile */
export const getMe = () => api.get('/auth/me');

/** Submit posts for analysis */
export const analyzeProfile = (posts) => api.post('/analysis', { posts });

/** Get all user analyses */
export const getAnalyses = () => api.get('/analysis');

/** Get single analysis by ID */
export const getAnalysisById = (id) => api.get(`/analysis/${id}`);

/** Delete an analysis */
export const deleteAnalysis = (id) => api.delete(`/analysis/${id}`);
