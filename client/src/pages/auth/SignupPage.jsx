import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layout/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import InputField from '../../components/auth/InputField';
import RoleSwitcher from '../../components/auth/RoleSwitcher';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import RobotLoader from '../../components/common/RobotLoader';

const SignupPage = () => {
  const { formData, loading, error, handleChange, handleRoleChange, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signup(e);
    if (success) {
      navigate('/login');
    }
  };

  return (
    <AuthLayout>
      <div className="relative w-full max-w-md">
        <RobotLoader 
          isLoading={loading} 
          message="Creating account..." 
        />
        
        <AuthCard 
          title="Sign Up" 
          subtitle="Create your account"
        >
          <form onSubmit={handleSubmit}>
            <RoleSwitcher 
              selectedRole={formData.role} 
              onRoleChange={handleRoleChange} 
            />

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <InputField
                id="name"
                label="Name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                icon={User}
                required
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <InputField
                id="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                required
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <InputField
                id="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                required
              />
            </motion.div>

            <div className="flex items-center gap-2 mb-6">
              <input 
                type="checkbox" 
                id="terms" 
                required 
                className="w-4 h-4 rounded border-white/10 bg-zinc-900 text-primary-cyan focus:ring-primary-cyan/50 focus:ring-offset-0"
              />
              <label htmlFor="terms" className="text-xs text-zinc-500">
                I accept the <span className="text-zinc-300">Terms</span> and <span className="text-zinc-300">Conditions</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full primary-btn primary-btn-violet flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <span>Registering...</span>
              ) : (
                <>
                  Sign Up
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
              Already have an account?{' '}
              <Link to="/login" className="text-primary-violet hover:underline hover:underline-offset-4 transition-all">
                Login
              </Link>
            </p>
          </form>
        </AuthCard>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
