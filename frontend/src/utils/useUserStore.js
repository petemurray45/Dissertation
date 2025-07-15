import { create } from "zustand";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const useUserStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isLoggedIn: !!localStorage.getItem("token"),

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),

  login: async (email, password) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token, user } = res.data;
      localStorage.setItem("token", token);

      const userRes = await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ user, token, isLoggedIn: true });
    } catch (err) {
      console.error("login failed", err);
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isLoggedIn: false });
  },

  register: async (name, email, password) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
      console.log("Register response:", res.data);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      set({ user, token, isLoggedIn: true });
    } catch (err) {
      console.error("failed to register", err);
    }
  },

  rehydrate: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        console.log("Sending token:", token);
        const res = await axios.get(`${BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set({
          token,
          user: res.data.user,
          isLoggedIn: true,
        });
      } catch (err) {
        console.log("Rehydration Failed", err);
        localStorage.removeItem("token");
        set({ user: null, token: null, isLoggedIn: false });
      }
    }
  },
}));
