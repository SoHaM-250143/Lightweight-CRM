import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiRequest } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('crm_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync token validation on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          // Fetch current user details
          const userData = await apiRequest('/auth/me', 'GET', null, token);
          setUser(userData);
        } catch (err) {
          console.error('Initial auth validation failed:', err);
          // Token expired or invalid
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest('/auth/login', 'POST', { email, password });
      localStorage.setItem('crm_token', data.token);
      setToken(data.token);
      setUser({ _id: data._id, name: data.name, email: data.email });
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest('/auth/register', 'POST', { name, email, password });
      localStorage.setItem('crm_token', data.token);
      setToken(data.token);
      setUser({ _id: data._id, name: data.name, email: data.email });
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed');
      setLoading(false);
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('crm_token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        setError,
      }}
    >
      {children}
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
