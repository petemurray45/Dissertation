import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:3000";

export const useListingStore = create((set, get) => ({
  // properties state
  properties: [],
  loading: false,
  error: null,
  currentProperty: null,

  // form state
  formData: {
    title: "",
    description: "",
    price: "",
    bedrooms: "",
    location: "",
    latitude: "",
    longitude: "",
    images: [],
  },

  setFormData: (update) => {
    set((state) => ({
      formData: typeof update === "function" ? update(state.formData) : update,
    }));
  },
  resetForm: () =>
    set({
      formData: {
        title: "",
        description: "",
        price: "",
        bedrooms: "",
        location: "",
        latitude: "",
        longitude: "",
        images: [],
      },
    }),

  addProperty: async (payload) => {
    set({ loading: true });

    try {
      console.log("Payload recieved from store", payload);
      await axios.post(`${BASE_URL}/api/properties`, payload);
      await get().fetchProperties();
      get().resetForm();
      toast.success("Property added successfully");

      // close modal
      document.getElementById("add_property_modal").close();
    } catch (err) {
      console.log("Error adding property", err);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  fetchProperties: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/properties`);
      set({ properties: response.data.data, error: null });
    } catch (err) {
      console.log("Error fetching properties", err);
      if (err.status === 429) {
        set({ error: "Rate limit exceeded", properties: [] });
      } else set({ error: "Something went wrong", properties: [] });
    } finally {
      set({ loading: false });
    }
  },

  deleteProperty: async () => {
    set({ loading: true });

    try {
      await axios.delete(`${BASE_URL}/api/properties/${id}`);
      set((prev) => ({
        properties: prev.properties.filter((property) => property.id !== id),
      }));
      toast.success("Property deleted successfully");
    } catch (err) {
      console.log("Error deleting property");
      if (err.response?.status === 429) toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  fetchProperty: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/properties/${id}`);
      console.log("Fetched property:", response.data.data);
      set({
        currentProperty: response.data.data,
        formData: response.data.data, // prefills form with current product data
        error: null,
      });
    } catch (err) {
      console.log("Error fetching property", err);
      set({ err: "Something went wrong", currentProperty: null });
    } finally {
      set({ loading: false });
    }
  },

  updateProperty: async (id) => {
    set({ loading: true });
    try {
      const { formData } = get();
      const response = axios.put(`${BASE_URL}/api/properties/${id}`, formData);
      set({ currentProperty: response.data.data });
      toast.success("Property updated successfully");
    } catch (err) {
      console.log("Error updating property");
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
}));
