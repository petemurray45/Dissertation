import React from "react";
import { ReactTyped } from "react-typed";
import { ArrowRight } from "lucide-react";
import Search from "./Search";

function Hero() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-center items-center h-[50vh]  mb-[10rem] ">
        {/* Text Overlay */}
        <div className="text-center flex flex-col pt-[2rem]">
          <p className="text-4xl text-black font-bold">
            DISCOVER THE PERFECT PLACE FOR YOU.
          </p>
          <div className=" text-3xl text-black mt-10">
            <p>
              Find your next{" "}
              <ReactTyped
                strings={["holiday rental", "cozy stay", "student flat"]}
                typeSpeed={130}
                backSpeed={90}
                loop
              />
            </p>
          </div>
        </div>
        <div className="h-full  w-[100%] ">
          <div className="h-full w-full">
            <img
              src="https://images.unsplash.com/photo-1585821569331-f071db2abd8d?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="room"
              className="object-cover h-full w-full rounded-bl-2xl"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
