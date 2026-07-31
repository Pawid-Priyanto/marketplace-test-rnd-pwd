import { apiClient } from './api';

export const OrderService = {
  getOrders: async (email: string) => {
    const response = await apiClient.get('/api/orders', { params: { email } });
    return response.data;
  },
  checkout: async (payload: any) => {
    const response = await apiClient.post('/api/checkout', payload);
    return response.data;
  },
};