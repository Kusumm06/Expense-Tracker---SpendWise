import api from './api';

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.success && response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
  }
  return response.data;
};

const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  if (response.data.success && response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
};

const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};
