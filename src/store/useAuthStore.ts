import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        // Simula delay de rede
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Aceita qualquer credencial
        if (email && password) {
          const user: User = {
            id: `user-${Date.now()}`,
            email,
            name: email.split('@')[0],
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
          return { success: true };
        }
        
        set({ isLoading: false });
        return { success: false, error: 'Email e senha são obrigatórios' };
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        
        // Simula delay de rede
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (name && email && password) {
          const user: User = {
            id: `user-${Date.now()}`,
            email,
            name,
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
          return { success: true };
        }
        
        set({ isLoading: false });
        return { success: false, error: 'Todos os campos são obrigatórios' };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'ballet-manager-auth',
    }
  )
);
