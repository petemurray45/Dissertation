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
      <div className="grid grid-cols-1 gap-10 justify-center items-center h-40 mb-[5rem]  ">
        <div className=" object-cover  w-[100%] ">
          <div className="relative w-full overflow-hidden h-[600px]">
            <img
              src="https://plus.unsplash.com/premium_photo-1728776080538-653e418842c9?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="room"
              className="object-cover w-full absolute  sm:rounded-none object-bottom"
            />
          </div>
        </div>
        {/* Text Overlay */}
      </div>
    </>
  );
}

export default Hero;
