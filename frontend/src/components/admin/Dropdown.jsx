import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

function DropDown() {
  const navigate = useNavigate();
  return (
    <div className="dropdown dropdown-end font-raleway">
      {/* Dropdown trigger */}
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <Menu className="size-5" />
      </button>

      <div
        tabIndex={0}
        className="dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-56 border-base-content/10 border border-gray-400"
      >
        <button
          className="w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors hover:bg-slate-300"
          onClick={() => {
            navigate("/");
          }}
        >
          Dashboard
        </button>
        <button
          className="w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors hover:bg-slate-300"
          onClick={() => {
            navigate("/addproperty");
          }}
        >
          Add a property
        </button>
      </div>
    </div>
  );
}

export default DropDown;
