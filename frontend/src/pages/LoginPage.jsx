import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Newspaper, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';

/**
 * LoginPage view for authenticating existing accounts
 */
const LoginPage = () => {
  const { login, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Capture target navigation state or fallback to /dashboard
  const redirectDestination = location.state?.from?.pathname || '/dashboard';

  const validateFields = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please provide a valid email format.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateFields()) return;

    try {
      await login(email.trim(), password);
      // Navigate to destination (replacing login in router history stacking)
      navigate(redirectDestination, { replace: true });
    } catch (err) {
      setGeneralError(
        err.response?.data?.message || err.message || 'Incorrect email or password.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 relative">
      
      {/* Decorative backing glows */}
      <div className="absolute w-[300px] h-[300px] bg-glow-indigo rounded-full top-1/4 left-1/4 pointer-events-none select-none z-0 opacity-40" />
      <div className="absolute w-[300px] h-[300px] bg-glow-indigo rounded-full bottom-1/4 right-1/4 pointer-events-none select-none z-0 opacity-40" />

      <div className="relative z-10 w-full max-w-md">
        
        {/* Brand header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-white font-bold text-xl font-heading mb-3 focus:outline-none"
          >
            <div className="p-2 bg-brand-accent/15 rounded-xl border border-brand-accent/20 text-brand-accent">
              <Newspaper className="w-6 h-6 shrink-0" />
            </div>
            <span className="flex items-center">
              NewsIntel<span className="text-brand-accent font-extrabold ml-0.5">AI</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-gray-100 font-heading">Welcome back</h2>
          <p className="text-xs text-gray-400 mt-1 tracking-wide">
            Sign in to access your intelligence reports
          </p>
        </div>

        {/* Form Card wrapper */}
        <div className="glass-panel p-8 rounded-xl">
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
            {generalError && (
              <div className="flex items-center gap-2.5 bg-red-950/20 border border-red-500/20 p-3 rounded-lg text-xs font-semibold text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{generalError}</span>
              </div>
            )}

            <Input
              label="Email Address"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              error={fieldErrors.email}
              required
            />

            <Input
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              error={fieldErrors.password}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isAuthLoading}
              className="w-full mt-2"
            >
              {isAuthLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </div>

        {/* Footer redirection link */}
        <div className="text-center mt-6 text-xs text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-accent hover:underline font-semibold focus:outline-none">
            Create an account
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default LoginPage;
