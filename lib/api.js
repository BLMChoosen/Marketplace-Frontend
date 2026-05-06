import axios from 'axios';

// Build baseURL: API host + /api prefix.
// NEXT_PUBLIC_API_URL is expected to be just the host (e.g. http://localhost:5000).
const RAW = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const HOST = RAW.replace(/\/+$/, '');
const API_URL = HOST.endsWith('/api') ? HOST : `${HOST}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject access token on every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh access token on 401
let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      !original._retry &&
      typeof window !== 'undefined'
    ) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return Promise.reject(error);

      original._retry = true;
      refreshing =
        refreshing ||
        axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } }
        );

      try {
        const res = await refreshing;
        refreshing = null;
        localStorage.setItem('access_token', res.data.access_token);
        original.headers.Authorization = `Bearer ${res.data.access_token}`;
        return api(original);
      } catch (refreshErr) {
        refreshing = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
