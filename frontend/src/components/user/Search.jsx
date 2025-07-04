import React from "react";
import UserAutocomplete from "./UserAutocomplete";
import { useListingStore } from "../../utils/useListingsStore";

function Search({ onSearch }) {
  const handleSearch = (e) => {
    e.preventDefault();

    setLocation(e.target.value);
    set;
  };
  return (
    <>
      <div className=" flex flex-col justify-center items-center mt-20 sm:mt-14 sm:mx-10 mb-5 text-black">
        <div>
          <h1 className="text-3xl font-bold">
            Find the perfect stay your way.
          </h1>
          <p className="text-xl mt-5">
            Simply enter a location like a workplace, a gym, a school to the
            search bar - and we'll find a stay for you.
          </p>
          <p className="text-2xl mt-3 font-bold">
            Our search will show only stays close to the places you frequent
            most.
          </p>
        </div>

        <div class="bg-white flex px-1 py-1 rounded-3xl border border-black  w-[60%] h-[80px] sm:w-[95%] mx-auto my-14">
          <UserAutocomplete onPlaceSelect={handleSearch} />
          <button
            type="button"
            class="bg-[#02343F] text-white hover:bg-[#f0edcc] hover:border-2 hover:border-black hover:text-black font-medium transition-all rounded-3xl px-5 py-2.5  sm:w-[40%] text-lg "
          >
            SEARCH
          </button>
        </div>
      </div>
    </>
  );
}

export default Search;
