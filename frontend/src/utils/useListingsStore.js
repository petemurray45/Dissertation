import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:3000";

export const useListingStore = create((set, get) => ({
  // properties state
  properties: [],
  loading: false,
  error: null,
  location: "",
  searchedLocation: "",
  maxTravelTime: 0,
  minPrice: 0,
  maxPrice: 0,
  currentProperty: null,
  searchSubmitted: false,
  // form state
  formData: {
    title: "",
    description: "",
    price_per_month: "",
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
        price_per_month: "",
        bedrooms: "",
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

  handleSearch: async (filters) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/properties`, {
        params: {
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
        },
      });

      const propsArray = Array.isArray(data) ? data : data.data;
      console.log("API response", data);

      const travelProps = await Promise.all(
        propsArray.map(async (property) => {
          console.log("Property:", property);
          console.log(
            "Fetching travel time\nOrigin:",
            filters.location,
            "\nDestination:",
            property.location
          );
          if (!property.location) {
            console.warn("Skipping property with missing location:", property);
            return { ...property, travelTime: null };
          }
          try {
            const res = await axios.get(`${BASE_URL}/api/properties/time`, {
              params: {
                origin: filters.location?.location || filters.location,
                destination: property?.location || property.location,
              },
            });
            const time = res.data.travelTime;
            return { ...property, travelTime: time };
          } catch (err) {
            console.log("Travel time fetch failed", err);
            return { ...property, travelTime: null };
          }
        })
      );

      set({
        properties: travelProps,
        searchedLocation: filters.location,
        searchSubmitted: true,
      });
    } catch (err) {
      console.log("Error fetching properties", err);
    }
  },

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

  deleteProperty: async (id) => {
    set({ loading: true });

    try {
      await axios.delete(`${BASE_URL}/api/properties/${id}`);

      set((prev) => {
        return {
          properties: prev.properties.filter((property) => property.id !== id),
        };
      });
      toast.success("Property deleted successfully");
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

  updateProperty: async (id) => {
    set({ loading: true });
    try {
      const { formData } = get();
      const response = await axios.put(
        `${BASE_URL}/api/properties/${id}`,
        formData
      );
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
