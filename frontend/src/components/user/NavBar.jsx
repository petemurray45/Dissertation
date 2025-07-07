import React from "react";
import DropDown from "../../components/user/DropDown";

function NavBar() {
  return (
    <>
      <div className="navbar absolute top-0 left-0  z-50  bg-gradient-to-b from-[#02343F]/90 via-[#02343F]/30 to-transparent h-16 md:h-20 w-full  mx-auto mb-5    ">
        <div className="flex justify-between items-center mx-auto">
          <a className="btn btn-ghost normal-case text-5xl  text-gray-200 text-shadow-md font-raleway font-bold ">
            Property-App
          </a>
        </div>
        <div>
          <DropDown />
        </div>
      </div>
    </>
  );
}

export default NavBar;
