import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || 'Something went wrong. Please try again.';
    
    // Don't log user objects or tokens
    if (process.env.NODE_ENV === 'development') {
      console.error(`API Error: ${error.response?.status} - ${message}`);
    }

    return Promise.reject(error);
  }
);

export default api;
