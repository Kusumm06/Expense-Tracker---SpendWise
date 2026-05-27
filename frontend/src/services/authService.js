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
  // Note: Local storage setting will be handled in AuthContext to support Remember Me
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
};

const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgotpassword', { email });
  return response.data;
};

const resetPassword = async (token, password) => {
  const response = await api.put(`/auth/resetpassword/${token}`, { password });
  return response.data;
};

export const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};
