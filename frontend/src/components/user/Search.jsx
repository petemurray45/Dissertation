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
      <div className=" flex flex-col justify-center items-center mt-20 sm:mt-14  mb-5 text-black bg-[#02343F] w-full">
        <div class="flex justify-end px-1 py-1 rounded-3xl overflow-hidden w-[60%] h-[80px] sm:w-[95%] mx-auto my-14 "></div>
      </div>
    </>
  );
}

export default Search;
