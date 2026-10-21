import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to dynamically inject the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('newsintel_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to catch unauthorized access and trigger user session reset
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If authorization check fails (session expired or invalid token)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('newsintel_token');
      
      // Dispatch a global event to prompt AuthContext reset without page reloads
      window.dispatchEvent(new Event('auth-logout'));
    }
    return Promise.reject(error);
  }
);

export default api;
