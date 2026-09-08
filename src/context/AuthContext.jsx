import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smart_tourism_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr_demo123',
      name: 'Alex Morgan',
      email: 'demo@smarttourism.com',
      member_since: 'January 2026'
    };
  });
  
  const [token, setToken] = useState(() => localStorage.getItem('smart_tourism_token') || 'demo_jwt_token');

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('smart_tourism_user', JSON.stringify(res.data.user));
      localStorage.setItem('smart_tourism_token', res.data.token);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('smart_tourism_user', JSON.stringify(res.data.user));
      localStorage.setItem('smart_tourism_token', res.data.token);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('smart_tourism_user');
    localStorage.removeItem('smart_tourism_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
