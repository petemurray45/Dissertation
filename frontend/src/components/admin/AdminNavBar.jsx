import React from "react";
import SignOut from "./SignOut.jsx";
import DropDown from "./DropDown";

function AdminNavBar() {
  return (
    <div className="navbar bg-base-100 p-5 font-raleway">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-3xl">Property-App</a>
      </div>
      <div className="flex-none">
        <SignOut />
        <DropDown />
      </div>
    </div>
  );
}

export default AdminNavBar;
