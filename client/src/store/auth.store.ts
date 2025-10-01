// src/store/auth.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type User } from "../types/user";
// import { getMe } from "../api/auth"; // optional if you implement checkUser later

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
  // optional: checkUser method if you want to hit /auth/me
  checkUser?: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      loading: false,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null }),
      updateUser: (updatedFields: Partial<User>) => {
        set((state) => ({
          ...state,
          user: state.user ? { ...state.user, ...updatedFields } : state.user,
        }));
      },
      // optional placeholder: you can add checkUser later that calls backend /auth/me
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({ token: state.token }),
      // serialize/deserialize is handled by zustand persist
    }
  )
);
