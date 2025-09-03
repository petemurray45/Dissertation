import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { useTravelStore } from "./useTravelStore";
import { useUserStore } from "./useUserStore";
import { useAdminStore } from "./useAdminStore";
import { useAgencyStore } from "./useAgencyStore";

const BASE_URL = "http://localhost:3000";

export const useListingStore = create((set, get) => ({
  // properties state
  properties: [],
  filteredProperties: [],
  loading: false,
  error: null,
  location: "",
  searchedLocation: "",
  maxTravelTime: 0,
  minPrice: 0,
  maxPrice: 0,
  ensuite: 0,
  currentProperty: null,
  searchSubmitted: false,
  travelSearchSubmitted: false,
  // form state
  formData: {
    title: "",
    description: "",
    price_per_month: "",
    property_type: "",
    ensuite: "",
    bed_type: "",
    wifi: "",
    pets: "",
    location: "",
    latitude: "",
    longitude: "",
    images: [],
  },

  searchFilters: {
    sortBy: "",
    maxPrice: 0,
    minPrice: 0,
    property_type: "",
    bed_type: "",
    ensuite: "",
    pets: "",
    wifi: "",
  },

  pendingFilters: {
    sortBy: "",
    minPrice: 0,
    maxPrice: 0,
    property_type: "",
    bed_type: "",
    ensuite: "",
    pets: "",
    wifi: "",
  },

  pagination: {
    currentPage: 1,
    totalCount: 0,
    perPage: 6,
  },

  setPage: (page) =>
    set((state) => ({
      pagination: { ...state.pagination, currentPage: page },
    })),

  setTotalCount: (count) =>
    set((state) => ({
      pagination: { ...state.pagination, totalCount: count },
    })),

  setLoading: (value) => set({ loading: value }),

  updatePropertyTravelTimes: (travelTimeResults) => {
    const updated = get().properties.map((property) => {
      const match = travelTimeResults.find((p) => p.id === property.id);
      return match ? { ...property, travelTimes: match.travelTimes } : property;
    });
    set({ properties: updated });
  },

  setPendingFilters: (updates) =>
    set((state) => ({
      pendingFilters: { ...state.pendingFilters, ...updates },
    })),

  clearFilters: () => {
    set((state) => ({
      searchFilters: {
        sortBy: "",
        maxPrice: 0,
        minPrice: 0,
        property_type: "",
        bed_type: "",
        ensuite: "",
        pets: "",
        wifi: "",
      },
      pendingFilters: {
        sortBy: "",
        maxPrice: 0,
        minPrice: 0,
        property_type: "",
        bed_type: "",
        ensuite: "",
        pets: "",
        wifi: "",
      },
      filteredProperties: state.properties,
    }));
  },

  fetchPaginatedProperties: async () => {
    const { pagination } = get();
    set({ loading: true });

    try {
      const res = await axios.get(
        `${BASE_URL}/api/properties?page=${pagination.currentPage}&limit=${pagination.perPage}`
      );
      set({
        properties: res.data.data,
        error: null,
      });
      get().setTotalCount(res.data.totalCount);
    } catch (err) {
      console.log("Error fetching paginated properties", err);
      set({ error: "Something went wrong", properties: [] });
    } finally {
      set({ loading: false });
    }
  },

  applyFilters: () => {
    set((state) => {
      const {
        minPrice,
        maxPrice,
        property_type,
        bed_type,
        ensuite,
        pets,
        wifi,
        sortBy,
      } = state.searchFilters;

      const { searchSubmitted, properties, filteredProperties } = state;

      const min = Number(minPrice);
      const max = Number(maxPrice);

      const source = searchSubmitted
        ? [...filteredProperties]
        : [...properties];

      const filtered = source
        .filter((p) => {
          return (
            (!min || p.price_per_month >= min) &&
            (!max || p.price_per_month <= max) &&
            (!property_type || p.property_type === property_type) &&
            (!bed_type || p.bed_type === bed_type) &&
            (!ensuite || p.ensuite === (ensuite === "yes")) &&
            (!pets || p.pets === (pets !== "yes")) &&
            (!wifi || p.wifi === (wifi !== "yes"))
          );
        })
        .sort((a, b) => {
          if (sortBy === "price_low_high")
            return a.price_per_month - b.price_per_month;
          if (sortBy === "price_high_low")
            return b.price_per_month - a.price_per_month;
          return 0;
        });
      return { filteredProperties: filtered };
    });
  },

  syncFilters: () => {
    const { pendingFilters } = get();
    set({ searchFilters: { ...pendingFilters } });
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
        price_per_month: "",
        propertyType: "",
        ensuite: "",
        bedType: "",
        wifi: "",
        pets: "",
        location: "",
        latitude: "",
        longitude: "",
        images: [],
      },
    }),

  setProperties: (newProperties) => set({ properties: newProperties }),
  setLocation: (loc) => set({ location: loc }),
  setMinPrice: (price) => set({ minPrice: price }),
  setMaxPrice: (price) => set({ maxPrice: price }),
  setMaxTravelTime: (time) => set({ maxTravelTime: time }),

  setSearchSubmitted: (value) => set({ searchSubmitted: value }),
  setTravelSearchSubmitted: (value) => set({ travelSearchSubmitted: value }),
  setSearchedLocation: (value) => set({ searchedLocation: value }),

  handleSearch: async (filters) => {
    set({ loading: true });

    try {
      const data = await useTravelStore
        .getState()
        .getPropertiesWithTravelTime(filters);
      console.log(data);
      set({
        properties: data,
        searchedLocation: filters.location,
        travelSearchSubmitted: true,
        loading: false,
      });
      get().applyFilters();
      set({ travelSearchSubmitted: true });
      console.log(properties);
    } catch (err) {
      console.log("Error fetching properties with travel times", err);
    } finally {
      set({ loading: false });
    }
  },

  addProperty: async (payload, token) => {
    set({ loading: true });

    try {
      console.log("Payload recieved from store", payload);

      if (!token) {
        toast.error("Authentication token is missing.");
        set({ loading: false });
        return;
      }

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post(`${BASE_URL}/api/properties`, payload, { headers });
      await get().fetchProperties();
      get().resetForm();

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
      const response = await axios.get(`${BASE_URL}/api/properties/`);
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

  deleteProperty: async (id, token) => {
    set({ loading: true });

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${BASE_URL}/api/properties/${id}`, { headers });

      set((prev) => {
        return {
          properties: prev.properties.filter((property) => property.id !== id),
        };
      });
    } catch (err) {
      console.log(
        "Error deleting property",
        err?.response?.data || err.message
      );
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
        // prefills form data with fetched property properties
        currentProperty: response.data.data,
        formData: {
          ...response.data.data,
          images: response.data.data.images.map((url) => ({
            url,
            existing: true, // for utilising the 'x' in edit property
          })),
        },
        error: null,
      });
    } catch (err) {
      console.log("Error fetching property", err);
      set({ err: "Something went wrong", currentProperty: null });
    } finally {
      set({ loading: false });
    }
  },

  fetchPropertiesRadius: async ({ lat, lng, radius, minPrice, maxPrice }) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get(`${BASE_URL}/api/properties/search`, {
        params: {
          lat,
          lng,
          radius,
          minPrice: minPrice || null,
          maxPrice: maxPrice || null,
        },
      });

      set({
        filteredProperties: response.data,
        loading: false,
        searchSubmitted: true,
      });
    } catch (err) {
      console.error("Failed to fetch properties", err);
      set({ error: "Failed to load properties", loading: false });
    }
  },

  updateProperty: async (id, payload, token) => {
    set({ loading: true });
    try {
      const { formData } = get();

      // Separate images into existing and new
      const existingImageUrls = formData.images
        .filter((img) => img.isExisting)
        .map((img) => img.url);

      const newImageUrls = formData.images
        .filter((img) => !img.isExisting)
        .map((img) => img.url);

      // Create a new payload that includes the separated image URLs
      const updatedPayload = {
        ...payload,
        existingImageUrls, // Tell the backend which ones to keep
        newImageUrls, // Tell the backend which ones to add
      };

      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.put(
        `${BASE_URL}/api/properties/${id}`,
        updatedPayload,
        { headers }
      );
      const updated =
        response.data?.property ?? response.data?.data ?? response.data;
      set((state) => ({
        properties: state.properties.map((p) =>
          p.id === Number(id) ? { ...p, ...updated } : p
        ),
        currentProperty: updated,
      }));
    } catch (err) {
      console.log("Error updating property");
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  addEnquiry: async (payload) => {
    set({ loading: true });

    try {
      console.log("Payload recieved", payload);
      const res = await axios.post(
        `${BASE_URL}/api/properties/insert-enquiry`,
        payload
      );
      if (!res.data.success)
        throw new Error(res.data.error || "Failed to create enquiry");
    } catch (err) {
      console.log("Error inserting property", err);
    } finally {
      set({ loading: false });
    }
  },
}));
