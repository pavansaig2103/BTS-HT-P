import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('accessflow_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.getMe();
        if (response.success && response.data?.user) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.warn('Session expired or invalid:', err.message);
        localStorage.removeItem('accessflow_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    if (response.success && response.data) {
      const { user: userData, token: tokenData } = response.data;
      localStorage.setItem('accessflow_token', tokenData);
      setToken(tokenData);
      setUser(userData);
      return userData;
    }
    throw new Error(response.error?.message || 'Login failed');
  };

  const register = async (name, email, password, preferredLanguage, explanationLevel) => {
    const response = await authApi.register({
      name,
      email,
      password,
      preferredLanguage,
      explanationLevel,
    });
    if (response.success && response.data) {
      const { user: userData, token: tokenData } = response.data;
      localStorage.setItem('accessflow_token', tokenData);
      setToken(tokenData);
      setUser(userData);
      return userData;
    }
    throw new Error(response.error?.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('accessflow_token');
    setToken(null);
    setUser(null);
  };

  const updateUserProfileState = (updatedProfile) => {
    if (user) {
      setUser({
        ...user,
        profile: {
          ...user.profile,
          ...updatedProfile,
        },
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUserProfileState,
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

export default AuthContext;
