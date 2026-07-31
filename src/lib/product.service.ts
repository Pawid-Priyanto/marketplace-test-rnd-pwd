import { apiClient } from './api';

export interface ProductQueryParams {
  page?: number;
  perPage?: number;
  search?: string;
  category?: string;
  sortBy?: string;
}

export const ProductService = {
  getProducts: async (params?: ProductQueryParams) => {
    const response = await apiClient.get('/api/products', { params });
    return response.data;
  },
  
  getProductById: async (id: string) => {
    const response = await apiClient.get(`/api/products/${id}`);
    return response.data;
  }
};