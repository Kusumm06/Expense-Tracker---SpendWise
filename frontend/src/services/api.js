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
  getBudgets: (month) => api.get(month ? `/budgets?month=${month}` : '/budgets'),
  createBudget: (data) => api.post('/budgets', data),
  deleteBudget: (id) => api.delete(`/budgets/${id}`),
  
  // Goals
  getGoals: () => api.get('/goals'),
  createGoal: (data) => api.post('/goals', data),
  updateGoal: (id, data) => api.put(`/goals/${id}`, data),
  deleteGoal: (id) => api.delete(`/goals/${id}`),
  
  // Analytics
  getSummary: () => api.get('/analytics/summary'),
  getCategories: () => api.get('/analytics/categories'),
  getTrends: () => api.get('/analytics/trends'),
  getTopCategories: () => api.get('/analytics/top-categories'),
  getAdvancedAnalytics: () => api.get('/analytics/advanced'),

  // Notifications
  getNotifications: () => api.get('/notifications'),
  markNotificationAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllNotificationsAsRead: () => api.put('/notifications/read-all'),

  // Reports
  getReports: (period) => api.get(period ? `/reports?period=${period}` : '/reports'),
};

export default api;
