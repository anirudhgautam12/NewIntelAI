import React, { createContext, useState, useEffect, useCallback } from 'react';
import { registerUserApi, loginUserApi, getMeApi } from '../api/auth.api.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // centralized sign-out callback
  const logout = useCallback(() => {
    localStorage.removeItem('newsintel_token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsAuthLoading(false);
  }, []);

  // user sign-in action
  const login = async (email, password) => {
    setIsAuthLoading(true);
    try {
      const data = await loginUserApi(email, password);
      localStorage.setItem('newsintel_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return data.user;
    } catch (error) {
      logout();
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  // user registration action
  const register = async (name, email, password) => {
    setIsAuthLoading(true);
    try {
      const data = await registerUserApi(name, email, password);
      localStorage.setItem('newsintel_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return data.user;
    } catch (error) {
      logout();
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  // refreshes and loads user profile from server using current token
  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem('newsintel_token');
    if (!storedToken) {
      logout();
      return;
    }
    
    try {
      setToken(storedToken);
      const userData = await getMeApi();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      // If token is invalid or request fails, sign out
      logout();
    } finally {
      setIsAuthLoading(false);
    }
  }, [logout]);

  // Initial user session checks
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Set up listener for custom logout trigger events from Axios interceptor
  useEffect(() => {
    const handleAuthLogout = () => {
      logout();
    };

    window.addEventListener('auth-logout', handleAuthLogout);
    return () => {
      window.removeEventListener('auth-logout', handleAuthLogout);
    };
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAuthLoading,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
