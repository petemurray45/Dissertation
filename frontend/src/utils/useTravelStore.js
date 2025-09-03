import { create } from "zustand";
import { useListingStore } from "./useListingsStore";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const useTravelStore = create((set, get) => ({
  travelResults: [],
  searchDestinations: [],
  nearbyPlaces: [],
  placesLoading: false,
  placesError: null,
  selectedTravelTime: null,
  searchedDestination: false,
  loading: false,

  setDestinations: (destination) => {
    const current = get().searchDestinations;
    // prevent dupes
    const toKey = (d) =>
      typeof d === "string"
        ? d.trim().toLowerCase()
        : `${Number(d.latitude)},${Number(d.longitude)}`;

    const newKey = toKey(destination);
    const exists = current.some((d) => toKey(d) === newKey);

    if (!exists) {
      set({ searchDestinations: [...current, destination] });
    }
  },

  setLoading: (value) => set({ loading: value }),

  setSearchedDestination: (value) => set({ searchedDestination: value }),

  resetSearchDestinations: () => set({ searchDestinations: [] }),

  setSelectedTravelTime: (travelTime) =>
    set({ selectedTravelTime: travelTime }),

  getPropertiesWithTravelTime: async (
    modes = ["DRIVING", "BICYCLING", "WALKING"]
  ) => {
    set({ loading: true });
    try {
      const destinations = get().searchDestinations;

      const { data } = await axios.post(
        `${BASE_URL}/api/properties/travel-time`,
        {
          destinations: destinations.map((d) =>
            typeof d === "string"
              ? { label: d, latitude: null, longitude: null }
              : { label: d.label, latitude: d.latitude, longitude: d.longitude }
          ),
          modes,
        }
      );
      console.log("API response with travel times", data);
      useListingStore.getState().updatePropertyTravelTimes(data);
      return data;
    } catch (err) {
      console.log("Error fetching travel times from backend", err);
    } finally {
      set({ loading: false });
    }
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

  fetchNearbyPlaces: async ({ lat, lng, type }) => {
    set({ placesLoading: true, placesError: null });

    try {
      const response = await axios.get(`${BASE_URL}/api/properties/places`, {
        params: { lat, lng, type },
      });

      set({ nearbyPlaces: response.data.places });
    } catch (err) {
      console.error("Failed to fetch nearby places", err);
      set({ placesError: "Failed to fetch places", nearbyPlaces: [] });
    } finally {
      set({ placesLoading: false });
    }
  },
}));
