import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layout/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import InputField from '../../components/auth/InputField';
import ScanningLogo from '../../components/auth/ScanningLogo';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const { formData, loading, error, handleChange, login } = useAuth();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(e);
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500); // Navigate after showing popup briefly
    }
  };

  return (
    <AuthLayout>
      <div className="relative w-full max-w-md">
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute -top-20 left-0 right-0 z-50 bg-green-500/10 border border-green-500/20 backdrop-blur-md p-4 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.2)] flex items-center justify-center gap-3"
            >
              <CheckCircle2 className="text-green-500" size={24} />
              <span className="text-green-400 font-medium tracking-tight">Login Successful! Redirecting...</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AuthCard 
          title="Login" 
          subtitle="Please log in to your account"
        >
          <ScanningLogo />
          
          <form onSubmit={handleSubmit}>
            <InputField
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              required
            />
            
            <InputField
              id="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              required
            />

            <div className="flex justify-end mb-6">
              <Link 
                to="/forgot-password" 
                className="text-xs text-zinc-500 hover:text-primary-cyan transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || showSuccess}
              className="w-full primary-btn primary-btn-cyan flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : showSuccess ? (
                <span>Authenticated</span>
              ) : (
                <>
                  Login
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            <p className="mt-8 text-center text-sm text-zinc-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-cyan hover:underline hover:underline-offset-4 transition-all">
                Sign Up
              </Link>
            </p>
          </form>
        </AuthCard>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
