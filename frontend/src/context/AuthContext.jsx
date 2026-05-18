import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authService.getCurrentUser();
          if (res && res.success) {
            setUser(res.data);
          } else {
            setToken(null);
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          setToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (userData) => {
    const res = await authService.login(userData);
    if (res && res.success) {
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUser(res.data);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res && res.success) {
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUser(res.data);
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
