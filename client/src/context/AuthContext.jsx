import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            setUser(res.data);
          } else {
            handleLocalLogout();
          }
        } catch (err) {
          console.error("Failed to fetch user session", err);
          handleLocalLogout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await authService.login({ email, password });
      if (res.success) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        setUser(res.user);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      const message = err.response?.data?.message || 'Server error occurred during login';
      setError(message);
      return { success: false, message };
    }
  };

  const signup = async (name, email, password) => {
    setError(null);
    try {
      const res = await authService.signup({ name, email, password });
      if (res.success) {
        return { success: true };
      }
      return { success: false, message: res.message || 'Signup failed' };
    } catch (err) {
      const message = err.response?.data?.message || 'Server error occurred during signup';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      handleLocalLogout();
    }
  };

  const handleLocalLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
