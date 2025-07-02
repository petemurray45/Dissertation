import React from "react";
import { ReactTyped } from "react-typed";
import { ArrowRight } from "lucide-react";
import Search from "./Search";

function Hero() {
  return (
    <>
      <div className="flex justify-center h-[20vh] mx-[5rem] my-[1rem] ">
        {/* Text Overlay */}
        <div className="inset-0 text-center flex flex-col pt-[2rem]">
          <p className="text-2xl text-black font-bold">
            DISCOVER THE PERFECT PLACE FOR YOU.
          </p>

          <div className="flex justify-center items-center">
            <p className="md:text-7xl sm:text-3xl text-4xl font-bold md:py-6">
              Find your next
            </p>
            <ReactTyped
              className="md:text-7xl sm:text-3xl text-4xl font-bold md:py-6 pl-2"
              strings={[
                "holiday rental",
                "cozy retreat",
                "short-term let",
                "student room",
              ]}
              typeSpeed={120}
              backSpeed={140}
              loop
            />
          </div>
        </div>
      </div>

      <div className="h-[450px] w-full relative inset-0 bg-[#02343F] rounded-2xl">
        <div className="absolute inset-0">
          <Search />
        </div>
      </div>
    </>
  );
}

export default Hero;
