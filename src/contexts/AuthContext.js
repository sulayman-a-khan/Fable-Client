'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleOAuthProvider } from '@react-oauth/google';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch current user on mount
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data.success) {
        setUser(data.user);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    if (data.success) {
      if (data.token) {
        localStorage.setItem('fable_token', data.token);
      }
      setUser(data.user);
      toast.success('Registration successful!');
      return data.user;
    }
  };

  const login = async (formData) => {
    const { data } = await api.post('/auth/login', formData);
    if (data.success) {
      if (data.token) {
        localStorage.setItem('fable_token', data.token);
      }
      setUser(data.user);
      toast.success('Welcome back!');
      return data.user;
    }
  };

  const googleLogin = async (googleData) => {
    const { data } = await api.post('/auth/google', googleData);
    if (data.success) {
      if (data.token) {
        localStorage.setItem('fable_token', data.token);
      }
      setUser(data.user);
      toast.success('Welcome!');
      return data.user;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Continue with client-side logout even if API fails
    }
    localStorage.removeItem('fable_token');
    setUser(null);
    toast.success('Logged out successfully');
    // Full page redirect to clear state
    window.location.href = '/';
  };

  const setRole = async (role) => {
    const { data } = await api.patch('/auth/role', { role });
    if (data.success) {
      setUser(data.user);
      toast.success(`Role set to ${role}`);
      return data.user;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isWriter: user?.role === 'writer',
    isUser: user?.role === 'user',
    register,
    login,
    googleLogin,
    logout,
    setRole,
    refreshUser: fetchUser,
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
