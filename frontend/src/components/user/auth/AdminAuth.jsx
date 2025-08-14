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
      className="h-screen w-full flex justify-center items-center"
      style={{
        backgroundImage: `linear-gradient(to right top, #ffffff, #d3d4d9, #a5abb5, #778491, #49606e, #435f6c, #3e5e69, #395d66, #5d7d85, #829fa6, #a9c3c8, #d1e7eb)`,
      }}
    >
      <div className="relative h-[800px] w-[650px] bg-white  rounded-2xl shadow-2xl">
        <div className="flex flex-col justify-end bg-[url('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] h-[45%] w-full rounded-tl-2xl rounded-tr-2xl bg-cover">
          <h1 className="flex flex-col  flex-reverse text-8xl text-white font-extrabold pl-4 pb-4 shadow-2xl">
            Hello Admin
          </h1>
        </div>

        <div className=" flex justify-center w-full h-auto">
          <div className="flex w-full h-[20rem] justify-center">
            <form id="signin-form" onSubmit={handleSubmit}>
              <div className="form-control">
                <div>
                  <div className="w-[500px] px-9 flex items-center  mt-12">
                    <UserRound className="size-10 mr-6" />
                    <input
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="p-3 border-b-2 border-b-gray-300 pl-10 py-transition-colors  focus:outline-none focus:border-b-2 focus:ring-0   w-full text-2xl"
                    />
                  </div>
                </div>
              </div>
              <div className="form-control">
                <div>
                  <div className="w-[500px] px-9 flex items-center  mt-12">
                    <Key className="size-10 mr-6" />
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="p-3 border-b-2 border-b-gray-300 pl-10 py-transition-colors  focus:outline-none focus:border-b-2 focus:ring-0   w-full text-2xl"
                    />
                  </div>
                </div>
              </div>
            </form>
            <button
              type="button"
              onClick={handleSubmit}
              className="absolute bottom-12 -right-14 bg-gray-600 text-white p-3 rounded-full shadow-md  hover:bg-[#02343F] hover:border-black"
            >
              <FaArrowAltCircleRight className="size-24 shadow-2xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAuth;
