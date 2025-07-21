import React from "react";
import DropDown from "../../components/user/Dropdown";
import { useUserStore } from "../../utils/useUserStore";
import { useNavigate } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";

function NavBar() {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  console.log("Rehydrated user:", user); // check if name and email are there

  const handleLogOut = (e) => {
    logout();
  };

  const handleLogin = (e) => {
    navigate("/login");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-[#02343F]/90 via-[#02343F]/30 to-transparent px-6 py-3">
        <div className="max-w-full mx-auto flex items-center justify-between relative">
          {/* title */}
          <div className="text-4xl font-semibold text-white font-raleway text-shadow-lg">
            Property App
          </div>

          {/* Nav links */}
          <ul className="absolute left-1/2 transform -translate-x-1/2 flex gap-6 text-sm font-medium text-white font-raleway">
            <li>
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  isActive
                    ? "border-b-4 border-b-[#02343F] text-3xl shadow-lg"
                    : "hover:border-b-4 border-b-[#02343F] text-3xl text-shadow-lg"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/properties"
                className={({ isActive }) =>
                  isActive
                    ? "border-b-4 border-b-[#02343F] shadow-lg text-3xl"
                    : "hover:border-b-4 border-b-[#02343F] text-3xl text-shadow-lg"
                }
              >
                Search
              </NavLink>
            </li>

            {user?.name && (
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive
                      ? "border-b-4 border-b-[#02343F] shadow-lg text-3xl"
                      : "hover:border-b-4 border-b-[#02343F] text-3xl text-shadow-lg"
                  }
                >
                  Profile
                </NavLink>
              </li>
            )}
          </ul>

          <div>
            {user?.name ? (
              <>
                <span className="text-gray-200 text-shadow-md font-raleway text-3xl mr-5 ml-0">
                  {user.name}
                </span>
                <button
                  className="text-3xl text-white font-raleway hover:border-b-4 border-b-[#02343F] text-shadow-lg"
                  onClick={handleLogOut}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className="text-3xl text-white font-raleway hover:border-b-4 border-b-[#02343F] text-shadow-lg"
                onClick={handleLogin}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
