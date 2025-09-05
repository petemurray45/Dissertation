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
      className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6"
      style={{
        backgroundImage: `linear-gradient(to right top, #ffffff, #d3d4d9, #a5abb5, #778491, #49606e, #435f6c, #3e5e69, #395d66, #5d7d85, #829fa6, #a9c3c8, #d1e7eb)`,
      }}
    >
      <Toaster position="top-center" />
      <div className="relative w-full max-w-md md:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header image */}
        <div
          className="h-40 sm:h-48 md:h-56 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1740&auto=format&fit=crop)",
          }}
        >
          <h1 className="text-white font-extrabold text-4xl sm:text-5xl md:text-6xl px-4 pb-4 pt-16 drop-shadow-lg">
            Hello Agent
          </h1>
        </div>

        {/* Login form */}
        <div className="flex justify-center w-full h-auto">
          <div className="flex w-full h-[20rem] justify-center">
            <form
              id="signin-form"
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 md:p-8 space-y-6"
            >
              {/* Agency Name */}
              <div className="form-control">
                <div className="flex items-center gap-3 border-b border-gray-300 focus-within:border-[#02343F]">
                  <UserRound className="shrink-0 size-6 sm:size-7 text-gray-600" />
                  <input
                    type="text"
                    placeholder="Enter agency name"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full py-3 outline-none text-lg"
                    data-testid="agency-name"
                  />
                </div>
              </div>

              {/* Login ID */}
              <div className="form-control">
                <div className="flex items-center gap-3 border-b border-gray-300 focus-within:border-[#02343F]">
                  <Key className="shrink-0 size-6 sm:size-7 text-gray-600" />
                  <input
                    type="password"
                    placeholder="Enter agency login ID"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full py-3 outline-none text-lg"
                    data-testid="agency-loginid"
                  />
                </div>
              </div>

              {/* Mobile button */}
              <button
                type="submit"
                className="md:hidden w-full h-12 rounded-xl bg-gray-700 text-white font-semibold hover:bg-[#02343F] transition"
                data-testid="agency-login-submit-desktop"
              >
                Sign in
              </button>
            </form>

            {/* Desktop floating button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="hidden md:flex items-center justify-center absolute bottom-6 right-6 bg-gray-600 text-white rounded-full shadow-md hover:bg-[#02343F] transition p-2"
              aria-label="Submit"
              data-testid="agency-login-submit-desktop"
            >
              <FaArrowAltCircleRight className="size-16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgencyAuth;
