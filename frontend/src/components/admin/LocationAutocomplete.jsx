import { useRef, useEffect, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


const LocationAutocomplete = ({ onPlaceSelect }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const libraries = ["places"];

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !window.google || !inputRef.current) return;

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
  }, [isLoaded]);

  return (
    <input
      type="text"
      placeholder="Enter location"
      ref={inputRef}
      className="input input-bordered w-full pl-10"
    />
  );
};

export default LocationAutocomplete;
