import { create } from 'zustand';
import api, { setAccessToken } from '../api/axios';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isAuthModalOpen: false,
  authModalMode: 'login', // 'login' | 'register'
  loading: false,
  error: null,

  openAuthModal: (mode = 'login') => set({ isAuthModalOpen: true, authModalMode: mode, error: null }),
  closeAuthModal: () => set({ isAuthModalOpen: false, error: null }),

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      setAccessToken(res.data.accessToken);
      set({ 
        user: res.data.user, 
        isAuthenticated: true, 
        isAuthModalOpen: false, 
        loading: false 
      });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Check your credentials.';
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  },

  register: async ({ name, email, password, college, hostel }) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/register', { name, email, password, college, hostel });
      setAccessToken(res.data.accessToken);
      set({ 
        user: res.data.user, 
        isAuthenticated: true, 
        isAuthModalOpen: false, 
        loading: false 
      });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {}
    setAccessToken(null);
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const res = await api.post('/auth/refresh');
      setAccessToken(res.data.accessToken);
      const userRes = await api.get('/auth/me');
      set({ user: userRes.data, isAuthenticated: true });
    } catch (e) {
      setAccessToken(null);
      set({ user: null, isAuthenticated: false });
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put('/auth/profile', profileData);
      set({ user: res.data.user, loading: false });
      return { success: true, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile.';
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  }
}));
