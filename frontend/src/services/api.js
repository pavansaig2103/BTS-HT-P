import axios from 'axios';

// Use provided VITE_API_BASE_URL or fallback to production API; ensure it ends with /api
const envUrl = import.meta.env.VITE_API_BASE_URL || 'https://accessflow-ai-api.onrender.com/api';
const cleanUrl = envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: cleanUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessflow_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle normalized error extraction & 401 redirection
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Clear token if invalid or expired (except on login/register routes)
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
          localStorage.removeItem('accessflow_token');
          localStorage.removeItem('accessflow_user');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error.response.data?.error || { message: error.response.data?.message || 'Server error' });
    }
    return Promise.reject({ message: error.message || 'Network connection failed' });
  }
);

export default api;
