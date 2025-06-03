// src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from '../types';

const API_URL = 'http://localhost:3001/api'; // URL de tu backend

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (username, password) => {
        try {
          const response = await fetch(`${API_URL}/auth/admin-login`, { // <--- LLAMA AL NUEVO ENDPOINT
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });

          if (!response.ok) {
            // const errorData = await response.json().catch(() => ({ error: "Error en el login" }));
            set({ user: null, isAuthenticated: false });
            return false; // Indica fallo
          }

          const data = await response.json(); // { message: "...", user: { id, username, name } /*, token: "..."*/ }
          
          if (data.user) { // Y en un caso real, if (data.user && data.token)
            set({ user: data.user, isAuthenticated: true });
            // localStorage.setItem('authToken', data.token); // Guarda el token
            return true; // Indica éxito
          }
          set({ user: null, isAuthenticated: false });
          return false; // Indica fallo

        } catch (error) {
          console.error('Error de red o al procesar el login:', error);
          set({ user: null, isAuthenticated: false });
          return false;
        }
      },
      logout: () => {
        // localStorage.removeItem('authToken'); // Elimina el token
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage-v2', // Cambia el nombre si quieres resetear el localStorage de versiones anteriores
    }
  )
);