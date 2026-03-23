/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await api.get('/api/auth/me');
          setUser(res.data);
          // Usage/Subscription are fetched directly with Profile now since we placed them in the model,
          // but we can also explicitly fetch if needed. We'll rely on the populated user object for now 
          // or we can fetch them explicitly if not populated. Let's just set the user for now 
          // as the backend was updated to return subscription/usageLimits in getUserProfile/me (if me uses it).
          // To be safe, let's explicitly refetch the profile using the new /api/user/profile endpoint to get everything.
          const profileRes = await api.get('/api/user/profile');
          setUser(profileRes.data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    
    // Fetch full profile info with usage/subscription
    const profileRes = await api.get('/api/user/profile');
    setUser(profileRes.data);
  };

  const register = async (userData) => {
    const res = await api.post('/api/auth/register', userData);
    localStorage.setItem('token', res.data.token);
    
    const profileRes = await api.get('/api/user/profile');
    setUser(profileRes.data);
  };
  
  const refreshProfile = async () => {
    try {
      const profileRes = await api.get('/api/user/profile');
      setUser(profileRes.data);
    } catch (e) {
      console.error('Failed to refresh profile', e);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, register, logout, loading, 
      isProfileOpen, setIsProfileOpen, refreshProfile 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
