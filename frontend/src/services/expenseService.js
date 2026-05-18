import api from './api';

const getExpenses = async () => {
  const response = await api.get('/expenses');
  return response.data;
};

const getExpense = async (id) => {
  const response = await api.get(`/expenses/${id}`);
  return response.data;
};

const createExpense = async (expenseData) => {
  // Use FormData if receipt image is included
  let data = expenseData;
  let headers = {};

  if (expenseData.receipt instanceof File) {
    const formData = new FormData();
    Object.keys(expenseData).forEach(key => {
      formData.append(key, expenseData[key]);
    });
    data = formData;
    headers = { 'Content-Type': 'multipart/form-data' };
  }

  const response = await api.post('/expenses', data, { headers });
  return response.data;
};

const updateExpense = async (id, expenseData) => {
  let data = expenseData;
  let headers = {};

  if (expenseData.receipt instanceof File) {
    const formData = new FormData();
    Object.keys(expenseData).forEach(key => {
      formData.append(key, expenseData[key]);
    });
    data = formData;
    headers = { 'Content-Type': 'multipart/form-data' };
  }

  const response = await api.put(`/expenses/${id}`, data, { headers });
  return response.data;
};

const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};

export const expenseService = {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
};
