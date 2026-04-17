import axios from 'axios';

const apiClient = axios.create({
  // baseURL: 'http://localhost:5000/api',
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
