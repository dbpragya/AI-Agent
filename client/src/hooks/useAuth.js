import { useState } from 'react';

export const useAuth = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member', // default role
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
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Logging in with:', formData.email, formData.password);
      // Simulate success
      return true;
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
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
