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
      <div className="flex flex-col justify-center items-center mb-5 text-black bg-[#02343F] w-full h-[400px]"></div>
    </>
  );
}

export default Search;
