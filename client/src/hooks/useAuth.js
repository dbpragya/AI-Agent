import { useState } from 'react';
import { loginUser, registerUser } from '../apis/auth';

export const useAuth = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: 'user@gmail.com',
    password: '123456',
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
    if (e && e.preventDefault) e.preventDefault();

    // Check if role is "team"
    if (formData.role === 'team') {
      setError('This section is under working');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'user', // Always pass "user" for member signup
      });
      console.log('Signup successful:', response);
      return true;
    } catch (err) {
      console.error('Signup error:', err);
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
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
