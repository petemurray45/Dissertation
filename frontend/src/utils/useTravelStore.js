import { create } from "zustand";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const useTravelStore = create((set) => ({
  travelResults: [],
  searchedOrigin: null,
  selectedTravelTime: null,

  setSelectedTravelTime: (travelTime) =>
    set({ selectedTravelTime: travelTime }),

  getPropertiesWithTravelTime: async (filters) => {
    try {
      const destination =
        typeof filters.location === "object"
          ? `${filters.location.latitude}, ${filters.location.longitude}`
          : filters.location;
      const { data } = await axios.get(`${BASE_URL}/api/travel-time`, {
        params: {
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          destination: destination,
        },
      });
      console.log("API response with travel times", data);
      set({ travelResults: data, searchedOrigin: filters.location });

      return data;
    } catch (err) {
      console.error("Error fetching travel times from google api", err);
    }
  },

  getTravelTimeForProperty: async (propertyId) => {
    const travelResults = useTravelStore.getState().travelResults;
    return (
      travelResults.find((prop) => prop.id === propertyId)?.travelTime || null
    );
  },
}));
