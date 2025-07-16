import React from "react";
import { useState } from "react";
import { Compass, User } from "lucide-react";
import UserAutocomplete from "./UserAutocomplete";
import { useListingStore } from "../../utils/useListingsStore";

function ProximitySearch({ onSearch }) {
  const {
    location,
    setLocation,
    maxTravelTime,
    setMaxTravelTime,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    setSearchSubmitted,
    setSearchedLocation,
  } = useListingStore();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Location at search time", location);

    onSearch({
      location,
      maxTravelTime,
      minPrice,
      maxPrice,
    });

    setSearchSubmitted(true);
    setSearchedLocation(location);
  };

  return (
    <div className="  mx-20">
      <div className="form-control border-4 rounded-xl border-bg-[#02343F]">
        <input
          type="text"
          className=" input focus:input-primary w-full bg-white border-2  h-20"
        ></input>
      </div>
    </div>
  );
}

export default ProximitySearch;
