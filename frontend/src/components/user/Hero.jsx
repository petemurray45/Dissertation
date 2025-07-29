import React from "react";
import { ReactTyped } from "react-typed";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import mac from "../../assets/mac.png";
import { FaArrowDown } from "react-icons/fa";
import { useState } from "react";
import UserAutocomplete from "./UserAutocomplete";

import Search from "./Search";

function Hero() {
  const searchBar = document.getElementById("search");

  const [destination, setDestination] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [radius, setRadius] = useState("10");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!destination) return;

    const query = new URLSearchParams({
      location: destination.label,
      lat: destination.latitude,
      lng: destination.longitude,
      minPrice,
      maxPrice,
      radius,
    });

    navigate(`/properties?${query.toString()}`);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center font-raleway h-[900px] my-40 ">
        <div className="grid grid-cols-2 w-full gap-20 justify-center mt-80">
          <div className="w-full flex justify-end pl-20">
            <img src={mac} className="h-[700px] w-[1000px]" />
          </div>
          <div className="flex flex-col justify-center items-start mr-24">
            <h1 className="text-7xl text-gray-200 text-shadow-xl">
              PropertyApp
            </h1>
            <p className="text-4xl mt-10 text-gray-200">
              Searching for a room that suits you has never been easier.
            </p>
            <div className="mt-10">
              <button
                className="btn w-64 h-16 bg-[#02343F] border-none  text-white rounded-md text-xl"
                type="button"
                onClick={() => {
                  searchBar?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Search Now
                <FaArrowDown size={24} />
              </button>
              <button
                className="btn w-64 h-16  bg-[#e3d6a1] text-black ml-5 rounded-md border-none text-xl"
                onClick={(e) => navigate("/properties")}
              >
                View All Rooms
                <FaArrowRight size={24} />
              </button>
            </div>
          </div>
        </div>
        <div className="px-20 mt-48 w-full">
          <form
            className="bg-[#02343F]  shadow-2xl p-4 rounded-xl flex flex-col sm:flex-row sm:items-center ap-4 md:h-36 gap-5 scroll-mt-24"
            id="search"
            onSubmit={handleSubmit}
          >
            <div className="flex gap-1 flex-1">
              <UserAutocomplete
                onPlaceSelect={({ location, latitude, longitude }) =>
                  setDestination({
                    label: location,
                    latitude,
                    longitude,
                  })
                }
                className="rounded-tl-md rounded-bl-md rounded-tr-none rounded-br-none border-2 sm:w-auto sm:h-20 md:h-24 flex-1 pl-5 sm:text-xl md:text-2xl basis-3/4"
                placeholder="Enter a location"
              />
              <select
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="rounded-tl-none rounded-bl-none rounded-tr-md rounded-br-md border-2 sm:w-auto sm:h-20 md:h-24 flex-1 ml-0 sm:text-xl md:text-2xl text-lg basis-1/4"
              >
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="15">15 km</option>
                <option value="20">20 km</option>
                <option value="30">30 km</option>
              </select>
            </div>
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="rounded-md border-2  sm:w-auto sm:h-20 md:h-24 flex-1 px-5 sm:text-xl md:text-2xl"
            />
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="rounded-md border-2  sm:w-auto sm:h-20 md:h-24 flex-1 px-5 sm:text-xl md:text-2xl"
            />
            <button
              type="submit"
              className="rounded-md bg-[#e3d6a1] text-black hover:bg-[#02343F]  hover:text-white hover:border-[#F0EDCC] sm:w-auto md:w-40 md:h-24 sm:text-xl md:text-2xl"
            >
              Search
            </button>
          </form>
        </div>

        {/* Text Overlay */}
      </div>
    </>
  );
}

export default Hero;
