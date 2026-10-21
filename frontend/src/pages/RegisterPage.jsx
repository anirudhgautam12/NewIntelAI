import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Newspaper, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';

/**
 * RegisterPage view for creating new user accounts
 */
const RegisterPage = () => {
  const { register, isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validateFields = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Full name is required.';
    }
    if (!email) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please provide a valid email format.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateFields()) return;

    try {
      await register(name.trim(), email.trim(), password);
      // Route user to main Dashboard on success
      navigate('/dashboard');
    } catch (err) {
      setGeneralError(
        err.response?.data?.message || err.message || 'Registration failed. Try again.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 relative">
      
      {/* Decorative flows */}
      <div className="absolute w-[300px] h-[300px] bg-glow-indigo rounded-full top-1/4 left-1/4 pointer-events-none select-none z-0 opacity-40" />
      <div className="absolute w-[300px] h-[300px] bg-glow-indigo rounded-full bottom-1/4 right-1/4 pointer-events-none select-none z-0 opacity-40" />

      <div className="relative z-10 w-full max-w-md">
        
        {/* Brand header */}
        <div className="flex flex-col items-center text-center mb-6">
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
          <h2 className="text-xl font-bold text-gray-100 font-heading">Create an account</h2>
          <p className="text-xs text-gray-400 mt-1 tracking-wide">
            Register to start mapping news intelligence reports
          </p>
        </div>

        {/* Form Card wrapper */}
        <div className="glass-panel p-8 rounded-xl">
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4.5">
            {generalError && (
              <div className="flex items-center gap-2.5 bg-red-950/20 border border-red-500/20 p-3 rounded-lg text-xs font-semibold text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{generalError}</span>
              </div>
            )}

            <Input
              label="Full Name"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              error={fieldErrors.name}
              required
            />

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

            <Input
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              error={fieldErrors.confirmPassword}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isAuthLoading}
              className="w-full mt-2"
            >
              {isAuthLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </div>

        {/* Footer redirection link */}
        <div className="text-center mt-6 text-xs text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-accent hover:underline font-semibold focus:outline-none">
            Sign in
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default RegisterPage;
