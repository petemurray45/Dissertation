import React from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

function DropDown() {
  const navigate = useNavigate();
  return (
    <div className="dropdown dropdown-end ">
      {/* Dropdown trigger */}
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <Menu className="size-10" />
      </button>

      <div
        tabIndex={0}
        className="dropdown-content mt-2 p-1 shadow-2xl bg-[#02343F] backdrop-blur-lg rounded-2xl w-80 border-base-content/10 border border-gray-400 text-white"
      >
        <button
          className="w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors hover:bg-slate-300"
          onClick={() => {
            navigate("/home");
          }}
        >
          Home
        </button>
        <button
          className="w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors hover:bg-slate-300"
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
