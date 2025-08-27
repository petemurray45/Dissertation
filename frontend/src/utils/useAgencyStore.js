import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";
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

  //enquiries catalog
  enquiries: [],
  enquiriesLoading: false,
  enquiriesError: null,
  enquiriesPage: 1,
  enquiriesLimit: 10,
  enquiriesTotal: 0,

  page: 1,
  limit: 6,
  totalCount: 0,

  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),

  setEnquiriesPage: (page) => set({ enquiriesPage: page }),
  setEnquiriesLimit: (limit) => set({ enquiriesLimit: limit }),

  setAgency: (agency) => set({ agency }),
  setHasHydrated: () => set({ hasHydrated: true }),
  reset: () =>
    set({
      agency: null,
      token: null,
      isLoggedIn: false,
      properties: [],
      error: null,
      agencies: [],
      agenciesLoading: false,
      agenciesError: null,
      loading: false,
      page: 1,
      limit: 6,
      totalCount: 0,
    }),

  rehydrate: async () => {
    const token = localStorage.getItem("agency_token");
    if (!token) {
      set({ hasHydrated: true });
      return;
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
      useAuthStore.getState().login(data.agency, "agent", data.token);

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
      useAuthStore.getState().login(data.agency, "agent", data.token);
      return data.agency;
    } catch (err) {
      const message = err?.response?.data?.error || "Login Failed";
      set({ error: message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  fetchPropertiesByAgency: async (agencyId, opts = {}) => {
    const { token, page: currentPage, limit: currentLimit } = get();
    const page = opts.page ?? currentPage ?? 1;
    const limit = opts.limit ?? currentLimit ?? 6;

    if (!token) {
      set({ error: "Unathorized" });
      return;
    }

    try {
      set({ loading: true, error: null, properties: [] });
      const { data } = await axios.get(
        `${BASE_URL}/api/agency/${agencyId}/agencyProperties`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            params: { page, limit },
          },
        }
      );
      set({
        properties: data?.properties || [],
        totalCount: data?.totalCount ?? 0,
        page: data?.page ?? page,
        limit: data?.limit ?? limit,
      });
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

  updateAgency: async (payload) => {
    try {
      const { token } = get();
      const { data } = await axios.put(`${BASE_URL}/api/agency/me`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ agency: data, error: null });
      return data;
    } catch (err) {
      console.error("Update agency failed", err);
      set({ error: "Failed to update agency details" });
      throw err;
    }
  },

  deleteAgency: async () => {
    try {
      const { token } = get();
      await axios.delete(`${BASE_URL}/api/agency/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({
        agency: null,
        token: null,
        agencies: [],
        isLoggedIn: false,
        error: null,
      });
      useAuthStore.getState().logout();
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        useAuthStore.getState().logout();
      }
      console.error("Delete agency failed", err);
      set({ error: "Failed to delete agency account" });
      throw err;
    }
  },

  fetchAgencyEnquiries: async (agencyId, { page, limit } = {}) => {
    const { token, enquiriesPage, enquiriesLimit } = get();
    if (!token) {
      set({ enquiriesError: "Unauthorized" });
      return;
    }

    const p = Number(page ?? enquiriesPage ?? 1);
    const l = Number(limit ?? enquiriesLimit ?? 10);

    try {
      set({ enquiriesLoading: true, enquiriesError: null });
      const { data } = await axios.get(
        `${BASE_URL}/api/agency/${agencyId}/enquiries`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: p, limit: l },
        }
      );
      set({
        enquiries: data.data || [],
        enquiriesTotal: data.totalCount || 0,
        enquiriesPage: data.page,
        enquiriesLimit: data.limit,
      });
    } catch (err) {
      set({
        enquiriesError:
          err?.response?.data?.error || "Failed to load enquiries",
      });
    } finally {
      set({ enquiriesLoading: false });
    }
  },

  updateEnquiryStatus: async (agencyId, enquiryId, status) => {
    const { token, enquiries } = get();
    if (!agencyId || !enquiryId) {
      console.error("updateEnquiryStatus called with bad ids:", {
        agencyId,
        enquiryId,
      });
      throw new Error("Missing IDs");
    }

    try {
      await axios.put(
        `${BASE_URL}/api/agency/${agencyId}/enquiries/${enquiryId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({
        enquiries: enquiries.map((e) =>
          e.id === enquiryId ? { ...e, status } : e
        ),
      });
    } catch (err) {
      console.error("Error updating enquiry status", err);
    }
  },
}));
