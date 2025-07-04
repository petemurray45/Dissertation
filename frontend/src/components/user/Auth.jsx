import { useState } from "react";
import { UserRound, Key } from "lucide-react";
import { FaArrowAltCircleRight } from "react-icons/fa";

function Auth() {
  const [mode, setmode] = useState("sign-in");
  return (
    <div className="relative h-[800px] w-[650px] bg-white  rounded-2xl shadow-2xl">
      <div className="flex flex-col justify-end bg-[url('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] h-[45%] w-full rounded-tl-2xl rounded-tr-2xl bg-cover">
        <h1 className="flex flex-col  flex-reverse text-8xl text-white font-extrabold pl-4 pb-4 shadow-2xl">
          Hello
        </h1>
      </div>
      {/* Tabs */}
      <div className="flex justify-center gap-20 mt-8">
        <button
          className={`pb-2 text-2xl font-semibold  ${
            mode === "sign-in"
              ? "text-[#02343F] border-t-4 border-t-[#02343F]"
              : "border-transparent text-gray-300 shadow:lg"
          }`}
          onClick={() => setmode("sign-in")}
        >
          Sign In
        </button>
        <button
          className={`pb-2 text-2xl font-semibold  ${
            mode === "sign-up"
              ? "text-[#02343F] border-t-4 border-t-[#02343F]"
              : "border-transparent text-gray-300"
          }`}
          onClick={() => setmode("sign-up")}
        >
          Sign Up
        </button>
      </div>

      <div className=" flex justify-center w-full h-auto">
        <div className="flex w-full h-[20rem] justify-center">
          <form>
            <div className="form-control">
              <div>
                <div className="w-[500px] px-9 flex items-center pointer-events-none text-base-content/50 mt-12">
                  <UserRound className="size-10 mr-6" />
                  <input
                    type="email"
                    placeholder="Enter email"
                    className="p-3 border-b-2 border-b-gray-300 pl-10 py-transition-colors duration-200  w-full text-2xl"
                  />
                </div>
              </div>
            </div>
            <div className="form-control">
              <div>
                <div className="w-[500px] px-9 flex items-center pointer-events-none text-base-content/50 mt-12">
                  <Key className="size-10 mr-6" />
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="p-3 border-b-2 border-b-gray-300 pl-10 py-transition-colors duration-200  w-full text-2xl"
                  />
                </div>
              </div>
            </div>
            <div className="w-full text-center mt-[6rem] mb-[2rem]">
              <h2 className="text-gray-400 text-2xl font-medium hover:text-[#02343F] hover:cursor-pointer">
                Forgot password?
              </h2>
            </div>
          </form>
          <button
            type="submit"
            className="absolute bottom-12 -right-14 bg-gray-600 text-white p-3 rounded-full shadow-md hover:bg-[#02343F] hover:border-black"
          >
            <FaArrowAltCircleRight className="size-24 shadow-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
