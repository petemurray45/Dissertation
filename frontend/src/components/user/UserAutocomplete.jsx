import { useRef, useEffect, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { debounce } from "lodash";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];

const UserAutocomplete = ({
  onPlaceSelect,
  className = "",
  placeholder = "",
}) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (!isLoaded) {
      console.log("Google Maps script not loaded yet");
      return;
    }

    if (
      !window.google ||
      !window.google.maps ||
      !window.google.maps.places ||
      !inputRef.current
    )
      return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode", "establishment"],
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
  }, [isLoaded]);

  return (
    <input
      type="text"
      placeholder={`${placeholder}`}
      ref={inputRef}
      className={`input pl-10 py-1  focus:input-primary focus:border-[#02343F] transition-colors  duration-200 input-bordered  ${className}`}
    />
  );
};

export default UserAutocomplete;
