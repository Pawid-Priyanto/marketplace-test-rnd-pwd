import { create } from 'zustand';
import { AuthService, type LoginPayload, type RegisterPayload, type User } from '../lib/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: AuthService.getUser(),
  isAuthenticated: AuthService.isAuthenticated(),
  isLoading: false,
  error: null,

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await AuthService.login(payload);
      
      if (response.success && response.data) {
        set({ 
          user: response.data.user, 
          isAuthenticated: true, 
          isLoading: false 
        });
        return true; 
      } else {
        set({ 
          error: response.message || 'Login failed', 
          isLoading: false 
        });
        return false;
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Network error occurred', 
        isLoading: false 
      });
      return false;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await AuthService.register(payload);
      
      if (response.success) {
        set({ isLoading: false });
        return true; 
      } else {
        set({ 
          error: response.message || 'Registration failed', 
          isLoading: false 
        });
        return false;
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Network error occurred', 
        isLoading: false 
      });
      return false;
    }
  },

  logout: () => {
    AuthService.logout();
    set({ user: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),
}));