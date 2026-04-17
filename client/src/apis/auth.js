import apiClient from './apiClient';

/**
 * Login user with email, password and a static role.
 * @param {Object} credentials - The login credentials.
 * @param {string} credentials.email - User's email.
 * @param {string} credentials.password - User's password.
 * @returns {Promise<Object>} The server response.
 */
export const loginUser = async ({ email, password }) => {
  const response = await apiClient.post('/auth/login', {
    email,
    password,
    role: 'user', // Static role as requested
  });
  return response.data;
};

/**
 * Register a new user.
 * @param {Object} userData - The registration data.
 * @returns {Promise<Object>} The server response.
 */
export const registerUser = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};
