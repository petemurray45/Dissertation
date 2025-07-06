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
      <div className="grid grid-cols-1 gap-10 justify-center items-center h-[30vh]  mb-[10rem]  ">
        <div className="h-[1600px] object-cover  w-[100%] mb-10 ">
          <div className="h-full w-full">
            <img
              src="https://images.unsplash.com/photo-1585821569331-f071db2abd8d?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="room"
              className="object-cover w-full h-[50%] sm:rounded-none"
            />
          </div>
        </div>
        {/* Text Overlay */}
        <div className="pl-[4rem] flex flex-col pt-[2rem]"></div>
      </div>
    </>
  );
}

export default Hero;
