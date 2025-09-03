import { useRef, useEffect, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];

const LocationAutocomplete = ({
  onPlaceSelect,
  className = "",
  placeholder = "Enter a location",
  dataTestId = "hero-location",
}) => {
  const isTestMode =
    typeof window !== "undefined" && localStorage.getItem("E2E") === "1";

  const [val, setVal] = useState("");
  if (isTestMode) {
    return (
      <input
        data-testid={dataTestId}
        className={`input input-bordered w-full ${className}`}
        placeholder={placeholder}
        value={val}
        onChange={(e) => {
          const v = e.target.value;
          setVal(v);
          onPlaceSelect?.({
            location: v,
            latitude: 54.597,
            longitude: -5.93,
          });
        }}
      />
    );
  }
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
    return (
      <input
        disabled
        data-testid={dataTestId}
        className={`input input-bordered w-full ${className}`}
        placeholder="Loading maps…"
      />
    );
  }

  return (
    <input
      type="text"
      data-testid={dataTestId}
      placeholder={placeholder}
      ref={inputRef}
      className={`input input-bordered w-full pl-10 font-raleway ${className}`}
    />
  );
};

export default LocationAutocomplete;
