import React from "react";
import { ReactTyped } from "react-typed";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import Search from "./Search";

function Hero() {
  const navigate = useNavigate();
  return (
    <>
      <div className="relative ">
        <div className=" object-cover  w-[100%] ">
          <div className="relative  h-[300px]">
            <img
              src="https://plus.unsplash.com/premium_photo-1728776080538-653e418842c9?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="room"
              className=" w-full absolute object-cover
               h-[500px]   sm:rounded-none object-center"
            />

            <div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-32  z-30"
              style={{ top: "430px" }}
            >
              <form className="bg-[#02343F] shadow-lg p-4 rounded-xl flex flex-col sm:flex-row sm:items-center ap-4 md:h-36 gap-5">
                <input
                  type="text"
                  placeholder="Location"
                  className="rounded-md border-2 sm:w-auto sm:h-20 md:h-24 flex-1 px-5 sm:text-xl md:text-2xl"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  className="rounded-md border-2  sm:w-auto sm:h-20 md:h-24 flex-1 px-5 sm:text-xl md:text-2xl"
                />
                <input
                  type="number"
                  placeholder="Min Price"
                  className="rounded-md border-2  sm:w-auto sm:h-20 md:h-24 flex-1 px-5 sm:text-xl md:text-2xl"
                />
                <button
                  type="submit"
                  className="rounded-md bg-[#F0EDCC] text-black hover:bg-[#02343F]  hover:text-white hover:border-[#F0EDCC] sm:w-auto md:w-40 md:h-24 sm:text-xl md:text-2xl"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
        {/* Text Overlay */}
      </div>
    </>
  );
}

export default Hero;
