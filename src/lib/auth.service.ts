import { apiClient } from './api';


export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: User;
  };
}

export const userEmail:  User | null = localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user') as string) : null;


export const AuthService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', payload);
    
    const responseData = response.data;
    
    if (responseData.success && responseData.data?.token) {
      localStorage.setItem('auth_token', responseData.data.token);
      
      localStorage.setItem('auth_user', JSON.stringify(responseData.data.user));
    }
    
    return responseData;
  },

 
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', payload);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
   
  },


  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },
  
  
  getUser: (): User | null => {
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
};