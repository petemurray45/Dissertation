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
  } = useListingStore();

  const handleSearch = (e) => {
    e.preventDefault();

    onSearch({
      location,
      maxTravelTime,
      minPrice,
      maxPrice,
    });
    setSearchSubmitted(true);
  };

  return (
    <div className="relative  max-w-7xl mx-auto mt-8 ">
      <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 translate-y-1/4 bg-white shadow-md rounded-lg p-6 w-11/12 max-w-full">
        <h2 className="text-4xl text-center mb-4 text-black font-medium">
          Search Properties across the UK and Ireland
        </h2>
        <div>
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 w-full gap-3  "
          >
            {/* Essential Location */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base text-black">
                  Enter Location
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <Compass className="size-5" />
                </div>

                <UserAutocomplete
                  onPlaceSelect={(value) => setLocation(value)}
                />
              </div>
            </div>
            {/*Max Travel Time */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base text-black">
                  Max travel time
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <Compass className="size-5" />
                </div>

                <input
                  type="number"
                  placeholder="Max travel time (mins)"
                  className="input pl-10 py-1 focus:input-primary focus:border-[#02343F] transition-colors duration-200 input-bordered w-full"
                  value={maxTravelTime}
                  onChange={(e) => setMaxTravelTime(Number(e.target.value))}
                />
              </div>
            </div>
            {/* Price filters */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base text-black">
                  Max price
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <Compass className="size-5" />
                </div>

                <input
                  type="number"
                  placeholder="Max price"
                  className="input pl-10 py-1 focus:input-primary focus:border-[#02343F] transition-colors duration-200 input-bordered w-full"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base text-black">
                  Min price
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <Compass className="size-5" />
                </div>

                <input
                  type="number"
                  placeholder="Min price"
                  className="input pl-10 py-1 focus:input-primary focus:border-[#02343F] transition-colors duration-200 input-bordered w-full"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                />
              </div>
            </div>

            <button
              className="btn rounded-lg bg-[#02343F] text-white mt-[3%] hover:bg-[#F0EDCC] hover:text-black col-span-2 "
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProximitySearch;
