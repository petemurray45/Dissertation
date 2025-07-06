import React from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

function DropDown() {
  const navigate = useNavigate();
  return (
    <div className="dropdown dropdown-end  ">
      {/* Dropdown trigger */}
      <button tabIndex={0} className="btn bg-transparent ">
        <Menu className="size-10 text-white hover:text-[#02343F]" />
      </button>

      <div
        tabIndex={0}
        className="dropdown-content mt-2 p-1 shadow-2xl bg-white  rounded-2xl w-80  border border-gray-400 text-black z-[999]"
      >
        <button
          className="w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors hover:bg-[#02343F] hover:text-white"
          onClick={() => {
            navigate("/home");
          }}
        >
          Home
        </button>
        <button
          className="w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors hover:bg-[#02343F] hover:text-white"
          onClick={() => {
            navigate("/properties");
          }}
        >
          View Properties
        </button>
      </div>
    </div>
  );
}

export default DropDown;
