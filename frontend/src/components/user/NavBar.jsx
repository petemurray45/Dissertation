import React from "react";
import DropDown from "../../components/user/DropDown";

function NavBar() {
  return (
    <>
      <div className="navbar flex   h-16 md:h-20 w-full max-w-[1800px] mx-auto  my-10 bg-[#02343F] rounded-xl ">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-3xl text-white ">
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
