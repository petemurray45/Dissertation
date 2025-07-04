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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-center items-center h-[50vh]  mb-[10rem]  ">
        {/* Text Overlay */}
        <div className="pl-[4rem] flex flex-col pt-[2rem]">
          <p className="text-4xl text-black font-bold text-shadow-md">
            DISCOVER THE PERFECT PLACE FOR YOU.
          </p>
          <div className=" text-3xl text-black mt-5">
            <p>
              Find your next{" "}
              <ReactTyped
                strings={["holiday rental", "cozy stay", "student flat"]}
                typeSpeed={130}
                backSpeed={90}
                loop
                className="text-shadow-sm"
              />
              <ul className="mt-4 text-2xl text-black text-shadow-sm">
                <li className="flex items-center my-6">
                  <IoIosCheckmarkCircle className="size-10 text-[#02343F]" />
                  <p className="pl-5">Commute-optimised Locations</p>
                </li>
                <li className="flex items-center my-6">
                  <IoIosCheckmarkCircle className="size-10 text-[#02343F]" />
                  <p className="pl-5">Curated Recomendations</p>
                </li>
                <li className="flex items-center my-5">
                  <IoIosCheckmarkCircle className="size-10 text-[#02343F]" />
                  <p className="pl-5">Dynamic Weather Updates</p>
                </li>
              </ul>
              <button
                className="mt-5 btn rounded-lg bg-[#02343F] text-white w-[30%] h-[14%] hover:bg-[#f0edcc] hover:text-black hover:border-2 hover:border-black"
                onClick={() => navigate("/properties")}
              >
                View Listings
                <FaArrowRight className="size-5" />
              </button>
            </p>
          </div>
        </div>
        <div className="h-full  w-[100%] ">
          <div className="h-full w-full border-2 border-gray-300 rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1585821569331-f071db2abd8d?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="room"
              className="object-cover h-full w-full  sm:rounded-none md:rounded-bl-2xl md:rounded-tl-2xl"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
