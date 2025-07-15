import React from "react";
import DropDown from "../../components/user/Dropdown";
import { useUserStore } from "../../utils/useUserStore";

function NavBar() {
  const { user, logout } = useUserStore();
  console.log("Rehydrated user:", user); // check if name and email are there

  return (
    <>
      <div className="navbar absolute top-0 left-0  z-50  bg-gradient-to-b from-[#02343F]/90 via-[#02343F]/30 to-transparent h-16 md:h-20 w-full  mx-auto mb-5    ">
        <div className="flex justify-between items-center max-w-7xl w-full mx-auto">
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <a className="btn btn-ghost normal-case text-5xl  text-gray-200 text-shadow-md font-raleway font-bold ">
              Property-App
            </a>
          </div>
        </div>

        <div className="ml-auto items-center space-x-4">
          {user?.name && (
            <span className="text-gray-200 text-shadow-md font-raleway text-3xl mr-5 ml-0">
              {user.name}
            </span>
          )}

          <DropDown />
        </div>
      </div>
    </>
  );
}

export default NavBar;
