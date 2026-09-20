import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  // Uses your Vercel environment variable in production, defaults to localhost for local dev
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to automatically inject the JWT token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('sdr_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;