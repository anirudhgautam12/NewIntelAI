import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import PageLoader from '../components/common/PageLoader.jsx';

/**
 * Route guard wrapper rendering children on valid JWT tokens, redirecting to Login otherwise
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return <PageLoader message="Verifying authentication session..." />;
  }

  if (!isAuthenticated) {
    // Redirect to login page and save referrer route state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
