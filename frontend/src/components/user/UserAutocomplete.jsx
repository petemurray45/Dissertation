import { useRef, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { debounce } from "lodash"; // This import is not used
import axios from "axios"; // This import is not used

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];

const LocationAutocomplete = ({ onPlaceSelect, className = "" }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["geocode"],
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (!place.geometry) return;

        const locationData = {
          location: place.formatted_address,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        };
        onPlaceSelect(locationData);
      });
    }
  }, [isLoaded, onPlaceSelect]);

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  return (
    <input
      type="text"
      placeholder="Enter location"
      ref={inputRef}
      className={`input input-bordered w-full pl-10 font-raleway ${className}`}
    />
  );
};

export default LocationAutocomplete;
