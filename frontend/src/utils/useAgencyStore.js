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
  hasHydrated: false,

  // agencies catalog
  agencies: [],
  agenciesLoading: false,
  agenciesError: null,

  setAgency: (agency) => set({ agency }),
  setHasHydrated: () => set({ hasHydrated: true }),
  logout: () => {
    localStorage.removeItem("agency_token");
    set({ agency: null, token: null, isLoggedIn: false });
  },

  rehydrate: async () => {
    const token = localStorage.getItem("agency_token");
    if (!token) {
      set({ hasHydrated: true });
    }

    try {
      set({ loading: true, error: null });
      const { data } = await axios.get(`${BASE_URL}/api/agency/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ agency: data.agency, token, isLoggedIn: true });
    } catch (err) {
      localStorage.removeItem("agency_token");
      set({ agency: null, token: null, isLoggedIn: false, error: null });
    } finally {
      set({ loading: false, hasHydrated: true });
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
      const message = err?.response?.data?.error || "Failed to register";
      set({ error: message });
      throw err;
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
      const message = err?.response?.data?.error || "Login Failed";
      set({ error: message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  fetchPropertiesByAgency: async (agencyId) => {
    const { token } = get();

    if (!token) {
      set({ error: "Unathorized" });
      return;
    }

    try {
      set({ loading: true, error: null });
      const { data } = await axios.get(
        `${BASE_URL}/api/agency/${agencyId}/agencyProperties`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ properties: data });
    } catch (err) {
      console.error("Error fetching agency properties", err);
    } finally {
      set({ loading: false });
    }
  },

  fetchAgencies: async (adminToken) => {
    if (get().agencies.length > 0) return get().agencies;

    try {
      set({ agenciesLoading: true, agenciesError: null });
      const { data } = await axios.get(`${BASE_URL}/api/agency/agencies`, {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      });
      set({ agencies: data.agencies || [] });
      return data.agencies || [];
    } catch (err) {
      const message =
        err?.response?.data?.error || "Failed to fetch agencies list";
      set({ agenciesError: message });
      throw err;
    } finally {
      set({ agenciesLoading: false });
    }
  },
}));
