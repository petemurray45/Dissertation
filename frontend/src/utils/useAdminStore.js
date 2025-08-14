import { create } from "zustand";
import axios from "axios";
import { EthernetPort } from "lucide-react";

const BASE_URL = "http://localhost:3000";

export const useAdminStore = create((set, get) => ({
  admin: null,
  token: localStorage.getItem("admin_token") || null,
  isLoggedIn: !!localStorage.getItem("admin_token"),
  loading: false,
  error: null,
  hasHydrated: false,

  setHasHydrated: () => set({ hasHydrated: true }),

  login: async ({ username, password }) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.post(`${BASE_URL}/api/admin/login`, {
        username,
        password,
      });
      localStorage.setItem("admin_token", data.token);
      set({ admin: data.user, token: data.token, isLoggedIn: true });
      return data.user;
    } catch (err) {
      set({ error: "Login failed" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("admin_token");
    set({ admin: null, token: null, isLoggedIn: false });
  },

  rehydrate: async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      set({ hasHydrated: true });
    }
    set({ token, isLoggedIn: true, hasHydrated: true });
  },
}));
