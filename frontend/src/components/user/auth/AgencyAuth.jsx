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

  const { login, register } = useAgencyStore();

  const navigate = useNavigate();

  // helper at top of file (reuse the one you already have if you exported it)
  function getRoleFromToken(token) {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1] || ""));
      return payload?.role ?? null;
    } catch {
      return null;
    }
  }

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    try {
      if (mode === "sign-in") {
        const agency = await login({ agency_name: agencyName, loginId });

        // DEBUG: confirm state and localStorage got set by the store
        const { token, agency: storeAgency } = useAgencyStore.getState();
        console.log("After login:", {
          storeAgency,
          token,
          ls: localStorage.getItem("agency_token"),
          role: getRoleFromToken(token || localStorage.getItem("agency_token")),
        });

        const role = getRoleFromToken(
          token || localStorage.getItem("agency_token")
        );
        if (role === "agent") {
          navigate("/agency/dashboard");
        } else {
          console.error("Token missing or wrong role. Not navigating.");
          return; // prevents redirect loop + clearing
        }

        if (agency) navigate("/agency/dashboard");
        return;
      }

      // register branch
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

      const { token } = useAgencyStore.getState();
      const role = getRoleFromToken(
        token || localStorage.getItem("agency_token")
      );
      if (role !== "agent") {
        console.error(
          "Registration OK but token missing/wrong. Not navigating."
        );
        return;
      }
      navigate("/agency/dashboard");
    } catch (err) {
      console.log("Error with login or register", err);
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6"
      style={{
        backgroundImage: `linear-gradient(to right top, #ffffff, #d3d4d9, #a5abb5, #778491, #49606e, #435f6c, #3e5e69, #395d66, #5d7d85, #829fa6, #a9c3c8, #d1e7eb)`,
      }}
    >
      <div className="relative w-full max-w-xl md:max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div
          className="h-40 sm:h-48 md:h-56 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1740&auto=format&fit=crop)",
          }}
        >
          <h1 className="text-white font-extrabold text-4xl sm:text-5xl md:text-6xl px-4 pb-4 pt-16 drop-shadow-lg">
            Welcome Agent
          </h1>
        </div>
        {/* Tabs */}
        <div className="flex justify-center gap-8 sm:gap-16 md:gap-20 mt-6 px-4">
          <button
            className={`pb-2 text-lg sm:text-xl md:text-2xl font-semibold border-b-4 transition ${
              mode === "sign-in"
                ? "text-[#02343F] border-[#02343F]"
                : "text-gray-400 border-transparent"
            }`}
            onClick={() => setmode("sign-in")}
          >
            Sign In
          </button>
          <button
            className={`pb-2 text-lg sm:text-xl md:text-2xl font-semibold border-b-4 transition ${
              mode === "register"
                ? "text-[#02343F] border-[#02343F]"
                : "text-gray-400 border-transparent"
            }`}
            onClick={() => setmode("register")}
          >
            Register Agency
          </button>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          {mode === "sign-in" ? (
            <div className=" flex justify-center w-full h-auto">
              <div className="flex w-full h-[20rem] justify-center">
                <form
                  id="signin-form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3  focus-within:border-[#02343F]">
                    <div>
                      <div className=" px-9 flex items-center  mt-12">
                        <UserRound className="size-10 mr-6" />
                        <input
                          type="text"
                          placeholder="Enter agency name"
                          value={agencyName}
                          onChange={(e) => setAgencyName(e.target.value)}
                          className="w-full py-3 outline-none text-lg border-b-2 p-4"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3  border-gray-300 focus-within:border-[#02343F]">
                    <div>
                      <div className="w-[500px] px-9 flex items-center  mt-12">
                        <Key className="size-10 mr-6" />
                        <input
                          type="password"
                          placeholder="Enter Agency Login ID"
                          value={loginId}
                          onChange={(e) => setLoginId(e.target.value)}
                          className="w-full py-3 outline-none text-lg border-b-2"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="md:hidden w-full h-12 rounded-xl bg-[#02343F] text-white font-semibold"
                  >
                    Continue
                  </button>
                </form>
                <button
                  type="button"
                  className="hidden md:flex items-center justify-center absolute bottom-6 right-6 bg-[#02343F] text-white rounded-full p-2 shadow-md hover:opacity-90"
                  onClick={handleSubmit}
                >
                  <FaArrowAltCircleRight className="size-16" />
                </button>
              </div>
            </div>
          ) : (
            <div className=" flex justify-center w-full h-auto ">
              <div className="flex w-full justify-center ">
                <form
                  id="signup-form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 border-b border-gray-300 focus-within:border-[#02343F]">
                    <div>
                      <div className="w-[500px] h-[15px] px-9 flex items-center mt-12">
                        <UserRound className="size-6 sm:size-7 text-gray-600" />
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
                  className="absolute bottom-12 -right-14 bg-[#02343F]  text-white p-3 rounded-full hover:bg-[#02343F] hover:border-black"
                  onClick={handleSubmit}
                >
                  <FaArrowAltCircleRight className="size-24 shadow-2xl" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgencyAuth;
