import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";

const BASE_URL = "http://localhost:3000";

export const useUserStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isLoggedIn: !!localStorage.getItem("token"),
  likedPropertyIds: [],
  hasHydrated: false,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLikedPropertyIds: (ids) => set({ likedPropertyIds: ids }),
  setHasHydrated: () => set({ hasHydrated: true }),
  reset: () =>
    set({
      user: null,
      token: null,
      isLoggedIn: false,
      likedPropertyIds: [],
    }),
  enquiries: [],
  enquiriesLoading: false,
  enquiriesError: null,

  clearEnquiries: () => set({ enquiries: [] }),

  login: async (email, password) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token, user } = res.data;
      useAuthStore.getState().login(user, "user", token);
      localStorage.setItem("token", token);

      set({ user, token, isLoggedIn: true });
      useAuthStore.getState().login(user, "user", token);
    } catch (err) {
      console.error("login failed", err);
    }
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
      useAuthStore.getState().login(user, "user", token);
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
          hasHydrated: true,
        });
        await get().fetchLikedProperties();
      } catch (err) {
        console.log("Rehydration Failed", err);
        localStorage.removeItem("token");
        set({ user: null, token: null, isLoggedIn: false });
      } finally {
        set({ hasHydrated: true });
      }
    }
  },

  addToLikes: async (property) => {
    const { token, likedPropertyIds, setLikedPropertyIds } = get();
    if (!token) return;

    try {
      const res = await axios.get(`${BASE_URL}/api/user/checkLikes`, {
        params: { propertyId: property.id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Check like result", res.data);

      if (res.data.liked) {
        await axios.delete(`${BASE_URL}/api/user/removelike`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { propertyId: property.id },
        });
        console.log("Removed from likes");

        setLikedPropertyIds(
          likedPropertyIds.filter((id) => id !== property.id)
        );
      } else {
        await axios.post(
          `${BASE_URL}/api/user/likes`,
          { propertyId: property.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setLikedPropertyIds([...likedPropertyIds, property.id]);
      }
    } catch (err) {
      console.error("💥 Error in addToLikes:");
      console.error("Full error:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Status:", err.response.status);
        console.error("Headers:", err.response.headers);
      } else if (err.request) {
        console.error("No response received:", err.request);
      } else {
        console.error("Error message:", err.message);
      }
      throw err;
    }
  },

  fetchLikedProperties: async () => {
    const { token } = get();
    if (!token) return;

    try {
      const res = await axios.get(`${BASE_URL}/api/user/getLikes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ likedPropertyIds: res.data.liked });
    } catch (err) {
      console.log("Failed to fetch liked properties");
    }
  },

  addNote: async ({ property_id, content }) => {
    const { user, token } = get();
    if (!user || !token) return;
    console.log(token);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/user/addNote`,
        {
          property_id,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Error adding note", err);
    }
  },

  fetchNotes: async ({ property_id }) => {
    const { user, token } = get();
    if (!user || !token) return;

    try {
      const res = await axios.get(
        `${BASE_URL}/api/user/getNotes/${user.id}/${property_id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      console.error("Error fetching notes", err);
    }
  },

  fetchAllNotes: async () => {
    const { user, token } = get();
    if (!user || !token) return;

    try {
      const res = await axios.get(
        `${BASE_URL}/api/user/getAllNotes/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      console.error("Error fetching all Notes", err);
    }
  },

  deleteNote: async (note_id) => {
    const { token } = get();

    try {
      await axios.delete(`${BASE_URL}/api/user/deleteNote/${note_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.log("Error deleting token", err);
    }
  },

  updateProfile: async (payLoad) => {
    const { user, token } = get();

    if (!user || !token) return;

    try {
      const { data } = await axios.patch(
        `${BASE_URL}/api/user/updateProfile/${user.id}`,
        payLoad,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ user: data.user });

      return data.user;
    } catch (err) {
      console.log("Error updating user", err);
    }
  },

  fetchUserEnquiries: async () => {
    const token = get().token;

    if (!token) {
      set({ enquiriesLoading: false, enquiriesError: null, enquiries: [] });
      return;
    }

    set({ enquiriesLoading: true, enquiriesError: null });
    try {
      const res = await axios.get(`${BASE_URL}/api/user/enquiries`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rows = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      rows.sort(
        (a, b) =>
          new Date(b.created_at || b.createdAt) -
          new Date(a.created_at || a.createdAt)
      );

      set({ enquiries: rows });
    } catch (err) {
      set({
        enquiriesError:
          err?.response?.data?.error || "Failed to load enquiries",
      });
    } finally {
      set({ enquiriesLoading: false });
    }
  },
}));
