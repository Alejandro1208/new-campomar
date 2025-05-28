import { create } from 'zustand';
import { AuthState } from '../types';
import { users } from '../data/initialData';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (username: string, password: string) => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    
    if (user) {
      set({ user, isAuthenticated: true });
      return true;
    }
    
    return false;
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));