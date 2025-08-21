import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound, Key } from "lucide-react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useAdminStore } from "../../../utils/useAdminStore";

function AdminAuth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAdminStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const admin = await login({ username, password });
      if (admin) {
        navigate("/admin");
      } else {
        console.log("Incorrect login credentials");
        return;
      }
    } catch (err) {
      console.error("Admin Login failed");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6"
      style={{
        backgroundImage: `linear-gradient(to right top, #ffffff, #d3d4d9, #a5abb5, #778491, #49606e, #435f6c, #3e5e69, #395d66, #5d7d85, #829fa6, #a9c3c8, #d1e7eb)`,
      }}
    >
      <div className="relative w-full max-w-md md:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div
          className="h-40 sm:h-48 md:h-56 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1742&auto=format&fit=crop)",
          }}
        >
          <h1 className="text-white font-extrabold text-4xl sm:text-5xl md:text-6xl px-4 pb-4 pt-16 drop-shadow-lg">
            Hello Admin
          </h1>
        </div>

        <div className=" flex justify-center w-full h-auto">
          <div className="flex w-full h-[20rem] justify-center">
            <form
              id="signin-form"
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 md:p-8 space-y-6"
            >
              <div className="form-control">
                <div>
                  <div className="flex items-center gap-3 border-b border-gray-300 focus-within:border-[#02343F]">
                    <UserRound className="shrink-0 size-6 sm:size-7 text-gray-600" />
                    <input
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full py-3 outline-none text-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="form-control">
                <div>
                  <div className="flex items-center gap-3 border-b border-gray-300 focus-within:border-[#02343F]">
                    <Key className="shrink-0 size-6 sm:size-7 text-gray-600" />
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-3 outline-none text-lg"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="md:hidden w-full h-12 rounded-xl bg-gray-700 text-white font-semibold hover:bg-[#02343F] transition"
              >
                Sign in
              </button>
            </form>
            <button
              type="button"
              onClick={handleSubmit}
              className="hidden md:flex items-center justify-center absolute bottom-6 right-6 bg-gray-600 text-white rounded-full shadow-md hover:bg-[#02343F] transition p-2"
              aria-label="Submit"
            >
              <FaArrowAltCircleRight className="size-16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAuth;
