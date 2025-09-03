// utils/useAuthStore.js
import { create } from "zustand";
import { useAgencyStore } from "./useAgencyStore";
import { useUserStore } from "./useUserStore";
import axios from "axios";

export const useAuthStore = create((set) => ({
  user: null,
  role: null,
  token: null,

  login: (user, role, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    set({ user, role, token });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    localStorage.removeItem("agency_token");
    localStorage.removeItem("user_token");
    localStorage.removeItem("admin_token");

    delete axios.defaults.headers.common["Authorization"];

    useAgencyStore.getState().reset?.();
    useUserStore.getState().reset?.();

    set({ user: null, role: null, token: null });
  },
}));
