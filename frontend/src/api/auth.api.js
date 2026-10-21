import api from './axios.js';

/**
 * Register a new user account
 */
export const registerUserApi = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data.data; // Returns { user, token }
};

/**
 * Log in to an existing user account
 */
export const loginUserApi = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data.data; // Returns { user, token }
};

/**
 * Get current authenticated user profile
 */
export const getMeApi = async () => {
  const response = await api.get('/auth/me');
  return response.data.data; // Returns user object directly
};
