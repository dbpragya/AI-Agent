import { useState } from 'react';
import { loginUser } from '../apis/auth';

export const useAuth = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member', // default role for internal state
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const login = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      console.log('Login successful:', response);
      // You might want to store tokens/user info here (localStorage, state, etc.)
      return true;
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Authentication failed. Please check your credentials.';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Signing up with:', formData);
      // Simulate success
      return true;
    } catch (err) {
      setError('Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    handleChange,
    handleRoleChange,
    login,
    signup,
  };
};
