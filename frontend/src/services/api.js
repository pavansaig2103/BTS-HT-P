import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessflow_token');
    if (token) {
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
