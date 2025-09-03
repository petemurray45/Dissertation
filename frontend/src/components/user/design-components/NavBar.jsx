import { useUserStore } from "../../../utils/useUserStore";
import { useAuthStore } from "../../../utils/useAuthStore";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

function NavBar() {
  const { user } = useUserStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogOut = (e) => {
    logout();
  };

  const handleLogin = (e) => {
    navigate("/user/login");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-[#02343F]/90 via-[#02343F]/30 to-transparent px-6 py-3">
        <div className="max-w-full mx-auto flex items-center justify-between relative">
          <div className="flex flex-1 justify-start">
            {user && (
              <div className="text-gray-200 text-shadow-md font-raleway md:text-3xl lg: text-3xl sm:text-xl mr-5 ml-0">
                {user.name}
              </div>
            )}
          </div>
          <div className="hidden  lg:flex items-center flex-1 justify-center">
            {/* Nav links */}
            <ul className="flex flex-nowrap justify-center gap-3 sm:gap-6 text-white font-raleway text-base sm:text-xl md:text-2xl">
              <li>
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    isActive
                      ? "border-b-4 border-b-[#02343F] text-3xl shadow-lg"
                      : "hover:border-b-4 border-b-[#02343F] md:text-3xl text-shadow-lg"
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
              <li>
                <NavLink
                  to="/propPal"
                  className={({ isActive }) =>
                    isActive
                      ? "border-b-4 border-b-[#02343F] shadow-lg text-3xl"
                      : "hover:border-b-4 border-b-[#02343F] text-3xl text-shadow-lg"
                  }
                >
                  PropPal
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
          </div>

          <div className="hidden  lg:flex flex-1 justify-end">
            {user?.name ? (
              <>
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
          {/* Mobile */}
          <button
            className="lg:hidden text-white"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={44} />
          </button>

          {isOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 font-raleway"
              onClick={() => setIsOpen(false)}
            >
              <div
                className="fixed left-0 top-0 w-full  bg-[#02343F]/85 backdrop-blur-md shadow-lg z-50 p-6 transform transition-transform duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl text-gray-200 font-bold">Menu</h2>
                  <button onClick={() => setIsOpen(false)}>
                    <X size={24} className="text-gray-200" />
                  </button>
                </div>

                <ul className="flex flex-col space-y-4 text-lg">
                  <li>
                    <NavLink
                      to="/home"
                      className={({ isActive }) =>
                        `block py-1 ${
                          isActive
                            ? "font-semibold text-gray-200"
                            : "text-white/90 hover:text-white"
                        }`
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/properties"
                      className={({ isActive }) =>
                        `block py-1 ${
                          isActive
                            ? "font-semibold text-gray-200"
                            : "text-white/90 hover:text-white"
                        }`
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      Search
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/propPal"
                      className={({ isActive }) =>
                        `block py-1 ${
                          isActive
                            ? "font-semibold text-gray-200"
                            : "text-white/90 hover:text-white"
                        }`
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      PropPal
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `block py-1 ${
                          isActive
                            ? "font-semibold text-gray-200"
                            : "text-white/90 hover:text-white"
                        }`
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </NavLink>
                  </li>

                  <li>
                    {user?.name ? (
                      <button
                        className="text-left text-gray-200 hover:text-white"
                        onClick={() => {
                          handleLogOut();
                          setIsOpen(false);
                        }}
                      >
                        Logout
                      </button>
                    ) : (
                      <button
                        className="text-left text-gray-200 hover:text-white"
                        onClick={() => {
                          handleLogin();
                          setIsOpen(false);
                        }}
                      >
                        Login
                      </button>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default NavBar;
