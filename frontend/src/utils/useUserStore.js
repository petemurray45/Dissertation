import { create } from "zustand";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const useUserStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isLoggedIn: !!localStorage.getItem("token"),
  likedPropertyIds: [],

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLikedPropertyIds: (ids) => set({ likedPropertyIds: ids }),
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
        await get().fetchLikedProperties();
      } catch (err) {
        console.log("Rehydration Failed", err);
        localStorage.removeItem("token");
        set({ user: null, token: null, isLoggedIn: false });
      }
    }
  },

  addToLikes: async (property) => {
    const { user, likedPropertyIds, setLikedPropertyIds } = get();
    if (!user) return;

    try {
      //check if liked
      const res = await axios.get(`${BASE_URL}/api/user/checkLikes`, {
        params: {
          userId: user.id,
          propertyId: property.id,
        },
      });
      console.log("Check like result", res.data);

      if (res.data.liked) {
        await axios.delete(`${BASE_URL}/api/user/removelike`, {
          params: {
            userId: user.id,
            propertyId: property.id,
          },
        });
        console.log("Removed from likes");

        // update ui straight away
        setLikedPropertyIds(
          likedPropertyIds.filter((id) => id !== property.id)
        );
      } else {
        await axios.post(`${BASE_URL}/api/user/likes`, {
          userId: user.id,
          propertyId: property.id,
        });

        // update ui straight away
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
    const { user } = get();

    if (!user) return;

    try {
      const res = await axios.get(`${BASE_URL}/api/user/getLikes`, {
        params: { userId: user.id },
      });

      set({ likedPropertyIds: res.data.liked });
    } catch (err) {
      console.log("Failed to fetch liked properties");
    }
  },
}));
