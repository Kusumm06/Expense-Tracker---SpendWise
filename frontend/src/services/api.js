import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiService = {
  // Transactions
  getTransactions: () => api.get('/transactions'),
  createTransaction: (data) => api.post('/transactions', data),
  
  // Budgets
  getBudgets: () => api.get('/budgets'),
  createBudget: (data) => api.post('/budgets', data),
  
  // Goals
  getGoals: () => api.get('/goals'),
  createGoal: (data) => api.post('/goals', data),
  
  // Analytics
  getSummary: () => api.get('/analytics/summary'),
  getCategories: () => api.get('/analytics/categories'),
  getTrends: () => api.get('/analytics/trends'),
};

export default api;
