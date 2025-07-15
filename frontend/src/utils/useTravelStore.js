import { create } from "zustand";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const useTravelStore = create((set, get) => ({
  travelResults: [],
  searchedDestination: null,
  searchDestinations: [],
  selectedTravelTime: null,

  addDestination: (destination) => {
    const current = get().searchDestinations;
    // prevent dupes
    if (!current.includes(destination)) {
      set({ searchDestinations: [...current, destination] });
    }
  },

  resetOrigins: () => set({ searchDestinations: [] }),

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
      set({ travelResults: data, searchedDestination: filters.location });

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

  getTravelTimesForAllRoutes: async (origin) => {
    try {
      const directions = new window.google.maps.DirectionsService();
      const destinations = get().searchDestinations;
      const fetchTime = (destination) => {
        let parsedDestination = destination;
        if (
          typeof destination === "object" &&
          destination.latitude &&
          destination.longitude
        ) {
          parsedDestination = {
            lat: parseFloat(destination.latitude),
            lng: parseFloat(destination.longitude),
          };
          console.log("Parsed destination", parsedDestination);
          console.log("Parsed origin", origin);
        }

        return new Promise((resolve, reject) => {
          directions.route(
            {
              origin: origin,
              destination: parsedDestination,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === "OK") {
                const duration =
                  result.routes[0]?.legs[0]?.duration?.text || "Unknown";
                resolve({ destination, duration });
              } else {
                reject({ destination, error: status });
              }
            }
          );
        });
      };
      const results = await Promise.allSettled(destinations.map(fetchTime));
      const parsedResults = results.map((r) =>
        r.status === "fulfilled"
          ? r.value
          : { destination: r.reason.destination, error: r.reason.error }
      );
      set({ travelResults: parsedResults });
      console.log(parsedResults);
      return parsedResults;
    } catch (err) {
      console.error("Unexpected error fetching travel times", err);
    }
  },
}));
