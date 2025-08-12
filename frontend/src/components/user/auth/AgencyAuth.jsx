import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AtSign } from "lucide-react";
import { UserRound, Key } from "lucide-react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useAgencyStore } from "../../../utils/useAgencyStore";
import { Toaster, toast } from "react-hot-toast";

function AgencyAuth() {
  const [mode, setmode] = useState("sign-in");
  const [agencyName, setAgencyName] = useState("");
  const [website, setWebsite] = useState("");
  const [agencyEmail, setAgencyEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loginId, setLoginId] = useState("");
  const [confirmLoginId, setConfirmLoginId] = useState("");

  const { login, register, loading } = useAgencyStore();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    try {
      if (mode === "sign-in") {
        await login({ agency_name: agencyName, loginId });
        navigate("/agency/dashboard");
      } else {
        if (loginId !== confirmLoginId) {
          toast.error("Login Id's must match");
          return;
        }
        await register({
          agency_name: agencyName,
          agency_email: agencyEmail,
          phone,
          loginId,
          website,
        });
        navigate("/agency/dashboard");
      }
    } catch (err) {
      console.log("Error with login or register", err);
    }
  };
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="relative h-[1000px] w-[800px] bg-white  rounded-2xl shadow-2xl">
        <div className="flex flex-col justify-end bg-[url('https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] h-[45%] w-full rounded-tl-2xl rounded-tr-2xl bg-cover">
          <h1 className="flex flex-col  flex-reverse text-6xl text-white font-extrabold pl-4 pb-4 shadow-2xl">
            Welcome Agent
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
              mode === "register"
                ? "text-[#02343F] border-t-4 border-t-[#02343F]"
                : "border-transparent text-gray-300"
            }`}
            onClick={() => setmode("register")}
          >
            Register Agency
          </button>
        </div>

        {mode === "sign-in" ? (
          <div className=" flex justify-center w-full h-auto">
            <div className="flex w-full h-[20rem] justify-center">
              <form id="signin-form" onSubmit={handleSubmit}>
                <div className="form-control">
                  <div>
                    <div className=" px-9 flex items-center  mt-12">
                      <UserRound className="size-10 mr-6" />
                      <input
                        type="email"
                        placeholder="Enter agency name"
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
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
                        placeholder="Enter Agency Login ID"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        className="p-3 border-b-2 border-b-gray-300 pl-10 py-transition-colors  focus:outline-none focus:border-b-2 focus:ring-0   w-full text-2xl"
                      />
                    </div>
                  </div>
                </div>
              </form>
              <button
                type="button"
                className="absolute bottom-12 -right-14 bg-gray-600 text-white p-3 rounded-full shadow-md  hover:bg-[#02343F] hover:border-black"
                onClick={handleSubmit}
              >
                <FaArrowAltCircleRight className="size-24 shadow-2xl" />
              </button>
            </div>
          </div>
        ) : (
          <div className=" flex justify-center w-full h-auto ">
            <div className="flex w-full justify-center ">
              <form id="signup-form" onSubmit={handleSubmit}>
                <div className="form-control">
                  <div>
                    <div className="w-[500px] h-[15px] px-9 flex items-center mt-12">
                      <UserRound className="size-10 mr-6" />
                      <input
                        type="text"
                        placeholder="Enter agency name"
                        value={agencyName}
                        onChange={(e) => {
                          setAgencyName(e.target.value);
                        }}
                        className="p-3 border-b-2 border-b-gray-300 pl-10 py-transition-colors  focus:outline-none focus:border-b-2 focus:ring-0   w-full text-2xl"
                      />
                    </div>
                  </div>
                </div>
                <div className="form-control">
                  <div>
                    <div className="w-[500px] h-[15px] px-9 flex items-center  mt-12">
                      <AtSign className="size-10 mr-6" />
                      <input
                        type="url"
                        placeholder="Enter website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="p-3 border-b-2 border-b-gray-300 pl-10 py-transition-colors  focus:outline-none focus:border-b-2 focus:ring-0   w-full text-2xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-control">
                  <div>
                    <div className="w-[500px] h-[15px] px-9 flex items-center mt-12">
                      <UserRound className="size-10 mr-6" />
                      <input
                        type="email"
                        placeholder="Enter agency email"
                        value={agencyEmail}
                        onChange={(e) => {
                          setAgencyEmail(e.target.value);
                        }}
                        className="p-3 border-b-2 border-b-gray-300 pl-10 py-transition-colors  focus:outline-none focus:border-b-2 focus:ring-0   w-full text-2xl"
                      />
                    </div>
                  </div>
                </div>
                <div className="form-control">
                  <div>
                    <div className="w-[500px] h-[15px] px-9 flex items-center   mt-12">
                      <Key className="size-10 mr-6" />
                      <input
                        type="number"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="p-3 border-b-2 border-b-gray-300 pl-10 py-transition-colors  focus:outline-none focus:border-b-2 focus:ring-0   w-full text-2xl"
                      />
                    </div>
                  </div>
                </div>
                <div className="form-control">
                  <div>
                    <div className="w-[500px] h-[15px] px-9 flex items-center  mt-12">
                      <Key className="size-10 mr-6" />
                      <input
                        type="password"
                        placeholder="Enter a login ID"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        className="p-3 border-b-2 border-b-gray-300 pl-10 py-transition-colors focus:outline-none focus:border-b-2 focus:ring-0  w-full text-2xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-control">
                  <div>
                    <div className="w-[500px] h-[15px] px-9 flex items-center  mt-12">
                      <Key className="size-10 mr-6" />
                      <input
                        type="password"
                        placeholder="Confirm login ID"
                        value={confirmLoginId}
                        onChange={(e) => setConfirmLoginId(e.target.value)}
                        className="p-3 border-b-2 border-b-gray-300 pl-10 py-transition-colors focus:outline-none focus:border-b-2 focus:ring-0  w-full text-2xl"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full text-center mt-[6rem] mb-[2rem]"></div>
              </form>
              <button
                type="button"
                className="absolute bottom-12 -right-14 bg-[#D1C1D7] text-white p-3 rounded-full hover:bg-[#02343F] hover:border-black"
                onClick={handleSubmit}
              >
                <FaArrowAltCircleRight className="size-24 shadow-2xl" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AgencyAuth;
