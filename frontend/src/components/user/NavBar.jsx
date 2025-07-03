import React from "react";
import DropDown from "../../components/user/DropDown";

function NavBar() {
  return (
    <>
      <div className="navbar  p-5 bg-[#02343F] ">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-3xl text-white ">
            Property-App
          </a>
        </div>
        <div className="flex-none">
          <DropDown />
        </div>
      </div>
    </>
  );
}

export default NavBar;
