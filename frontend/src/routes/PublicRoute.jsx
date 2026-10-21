import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import PageLoader from '../components/common/PageLoader.jsx';

/**
 * PublicRoute wrapper to auto-redirect authenticated sessions away from guest-only views (like login/register)
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <PageLoader message="Validating user session..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
