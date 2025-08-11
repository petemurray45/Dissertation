import { create } from "zustand";
import axios from "axios";
import { log } from "console";
const BASE_URL = "http://localhost:3000";

export const useAgencyStore = create((set, get) => ({
  agency: null,
  token: localStorage.getItem("agency_token") || null,
  isLoggedIn: !!localStorage.getItem("agency_token"),
  loading: false,
  error: null,

  setAgency: (agency) => set({ agency }),
  logout: () => {
    localStorage.removeItem("agency_token");
    set({ agency: null, token: null, isLoggedIn: false });
  },

  rehydrate: async () => {
    const token = localStorage.getItem("agency_token");
    if (!token) return;

    try {
      set({ loading: true, error: null });
      const { data } = await axios.post(`${BASE_URL}/api/agency/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ agency: data.agency, token, isLoggedIn: true });
    } catch (err) {
      localStorage.removeItem("agency_token");
      set({ agency: null, token: null, isLoggedIn: false, error: null });
    } finally {
      set({ loading: false });
    }
  },

  register: async ({ name, website, email, phone, loginId }) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.post(
        `${BASE_URL}/api/agency/registerAgency`,
        {
          name,
          website,
          email,
          phone,
          loginId,
        }
      );
      localStorage.setItem("agency_token", data.token);
      set({ agency: data.agency, token: data.token, isLoggedIn: true });
      return data.agency;
    } catch (err) {
      console.log("Error registering agency", err);
    } finally {
      set({ loading: false });
    }
  },

  login: async ({ name, loginId }) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.post(`${BASE_URL}/api/agency/agenctLogin`, {
        name,
        loginId,
      });
      localStorage.setItem("agency_token", data.token);
      set({ agency: data.agency, token: data.token, isLoggedIn: true });
      return data.agency;
    } catch (err) {
      console.log("Error logging agency in", err);
    } finally {
      set({ loading: false });
    }
  },
}));
