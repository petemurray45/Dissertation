import { create } from "zustand";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const userStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,

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
      set({ user, token });
    } catch (err) {
      console.error("login failed", err);
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  register: async (name, email, password) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      set({ user, token });
    } catch (err) {
      console.error("User already exists", err);
    }
  },

  isLoggedIn: () => !!localStorage.getItem("token"),
}));
