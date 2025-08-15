import { useRef, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];

export default function LocationAutocomplete({ onPlaceSelect }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const listenerRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    // only init once when script is loaded and input is mounted
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return;

    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"],
      // ask for only what you need
      fields: ["formatted_address", "geometry"],
    });
    autocompleteRef.current = ac;

    listenerRef.current = ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      if (!place || !place.geometry) return;

      onPlaceSelect?.({
        location: place.formatted_address || "",
        latitude: place.geometry.location?.lat?.() ?? "",
        longitude: place.geometry.location?.lng?.() ?? "",
      });
    });

    // cleanup on unmount
    return () => {
      if (listenerRef.current) {
        window.google.maps.event.removeListener(listenerRef.current);
        listenerRef.current = null;
      }
      autocompleteRef.current = null;
    };
  }, [isLoaded, onPlaceSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Enter location"
      autoComplete="off"
      className="input input-bordered w-full pl-10 font-raleway"
    />
  );
}
