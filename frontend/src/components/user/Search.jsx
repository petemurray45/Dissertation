import React from "react";

function Search() {
  return (
    <>
      <div className=" flex flex-col justify-center items-center mt-20 mx-52 mb-5 text-white">
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

        <div class="bg-white flex px-1 py-1 rounded-full border border-black overflow-hidden w-[80%] h-[80px] mx-auto my-14">
          <input
            type="email"
            placeholder="Enter a location...."
            class="w-full outline-none bg-white pl-4 text-lg"
          />
          <button
            type="button"
            class="bg-gray-300 hover:bg-[#f0edcc] transition-all rounded-full px-5 py-2.5 w-[20%] text-lg text-black"
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
}

export default Search;
