import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    try {
      const data = await api.get('/users/me');
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (e) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const login = async (account, password) => {
    const data = await api.post('/users/login', { account, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (formData) => {
    const data = await api.post('/users/register', formData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
