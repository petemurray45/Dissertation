import { create } from "zustand";
import axios from "axios";
const BASE_URL = "http://localhost:3000";

export const useAgencyStore = create((set, get) => ({
  agency: null,
  token: localStorage.getItem("agency_token") || null,
  isLoggedIn: !!localStorage.getItem("agency_token"),
  loading: false,
  properties: [],
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

  register: async ({ agency_name, agency_email, phone, loginId, website }) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.post(
        `${BASE_URL}/api/agency/registerAgency`,
        {
          agency_name,
          agency_email,
          phone,
          loginId,
          website,
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

  login: async ({ agency_name, loginId }) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.post(`${BASE_URL}/api/agency/agencyLogin`, {
        agency_name,
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

  fetchPropertiesByAgency: async (agencyId) => {
    set({ loading: true });
    try {
      const res = await axios.get(
        `${BASE_URL}/api/agency/${agencyId}/agencyProperties`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = res.json();
      set({ properties: data });
    } catch (err) {
      console.error("Error fetching agency properties", err);
    } finally {
      set({ loading: false });
    }
  },
}));
