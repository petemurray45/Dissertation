import React from "react";
import UserAutocomplete from "./UserAutocomplete";
import { useListingStore } from "../../utils/useListingsStore";
import { Compass, User } from "lucide-react";

function Search({ onSearch }) {
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
    <>
      <div className="text-black bg-[#02343F] mt-64 py-10 w-full h-40">
        <div className="max-w-screen-xl w-full mx-auto px-10">
          <form className="grid grid-cols-5 justify-center items-end gap-10">
            <div className="form-control">
              <label className="label text-white">
                <span>Location</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50 ">
                  <Compass className="size-5 " />
                </div>
                <UserAutocomplete
                  onPlaceSelect={(value) => setLocation(value)}
                  className="rounded-md w-60"
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label text-white">
                <span>Max Travel Time</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <Compass className="size-5" />
                </div>
                <input
                  type="number"
                  placeholder="Max travel time (mins)"
                  className="input pl-10 py-1 focus:input-primary focus:border-[#02343F] transition-colors duration-200 input-bordered  rounded-md"
                  value={maxTravelTime}
                  onChange={(e) => setMaxTravelTime(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label text-white">
                <span>Max Price</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <Compass className="size-5" />
                </div>
                <input
                  type="number"
                  placeholder="Max price"
                  className="input pl-10 py-1 focus:input-primary focus:border-[#02343F] transition-colors duration-200 input-bordered  rounded-md"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label text-white">
                <span>Min Price</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <Compass className="size-5" />
                </div>
                <input
                  type="number"
                  placeholder="Min price"
                  className="input pl-10 py-1 focus:input-primary focus:border-[#02343F] transition-colors duration-200 input-bordered  rounded-md"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                />
              </div>
            </div>
            <button
              className="btn bg-white text-black hover:bg-[#F0EDCC]  rounded-md"
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Search;
