import { apiClient } from './api';

export const DashboardService = {
  getStats: async () => {
    const response = await apiClient.get('/api/dashboard/stats');
    return response.data;
  },
  getCategories: async () => {
    const response = await apiClient.get('/api/categories');
    return response.data;
  },
  getRecentOrders: async () => {
    const response = await apiClient.get('/api/orders/recent');
    return response.data;
  },
};