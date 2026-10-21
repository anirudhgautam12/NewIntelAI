import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

/**
 * Custom hook to consume the AuthContext state and methods
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
