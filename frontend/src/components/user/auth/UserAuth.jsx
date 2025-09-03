import { useState } from "react";
import { UserRound, Key } from "lucide-react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { AtSign } from "lucide-react";
import { useUserStore } from "../../../utils/useUserStore";
import { useNavigate } from "react-router-dom";

function UserAuth() {
  const [mode, setMode] = useState("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const login = useUserStore((state) => state.login);
  const register = useUserStore((state) => state.register);
  const navigate = useNavigate();

  const clearCustomValidity = (e) => e.target.setCustomValidity("");
  const setValidity = (el, msg) => el.setCustomValidity(msg || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (mode === "sign-up") {
      const pwdEl = form.querySelector('input[name="password"]');
      const confirmEl = form.querySelector('input[name="confirm"]');

      if (pwdEl && confirmEl && pwdEl.value !== confirmEl.value) {
        confirmEl.setCustomValidity("Passwords do not match");
        confirmEl.reportValidity();
        return;
      } else if (confirmEl) {
        confirmEl.setCustomValidity("");
      }
    }

    try {
      if (mode === "sign-in") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate("/home");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6"
      style={{
        backgroundImage:
          "linear-gradient(to right top, #ffffff, #d3d4d9, #a5abb5, #778491, #49606e, #435f6c, #3e5e69, #395d66, #5d7d85, #829fa6, #a9c3c8, #d1e7eb)",
      }}
    >
      <div className="relative w-full max-w-md md:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header image */}
        <div
          className="h-40 sm:h-48 md:h-56 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1742&auto=format&fit=crop)",
          }}
        >
          <h1 className="text-white font-extrabold text-4xl sm:text-5xl md:text-6xl px-4 pb-4 pt-16 drop-shadow-lg">
            Hello
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-10 sm:gap-16 md:gap-20 pt-4">
          <button
            type="button"
            onClick={() => setMode("sign-in")}
            className={`pb-2 text-lg sm:text-xl font-semibold border-b-4 transition ${
              mode === "sign-in"
                ? "text-[#02343F] border-[#02343F]"
                : "text-gray-300 border-transparent"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("sign-up")}
            className={`pb-2 text-lg sm:text-xl font-semibold border-b-4 transition ${
              mode === "sign-up"
                ? "text-[#02343F] border-[#02343F]"
                : "text-gray-300 border-transparent"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form area */}
        <div className="flex justify-center w-full h-auto">
          <div className="flex  min-h-[18rem] justify-center relative">
            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 md:p-8 space-y-6 w-full"
              noValidate
            >
              {mode === "sign-up" && (
                <div className="form-control">
                  <div className="flex items-center gap-3 border-b border-gray-300 focus-within:border-[#02343F]">
                    <UserRound className="shrink-0 size-6 sm:size-7 text-gray-600" />
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full py-3 outline-none text-lg"
                    />
                  </div>
                </div>
              )}

              <div className="form-control">
                <div className="flex items-center gap-3 border-b border-gray-300 focus-within:border-[#02343F]">
                  {mode === "sign-up" ? (
                    <AtSign className="shrink-0 size-6 sm:size-7 text-gray-600" />
                  ) : (
                    <UserRound className="shrink-0 size-6 sm:size-7 text-gray-600" />
                  )}
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full py-3 outline-none text-lg"
                  />
                </div>
              </div>

              <div className="form-control">
                <div className="flex items-center gap-3 border-b border-gray-300 focus-within:border-[#02343F]">
                  <Key className="shrink-0 size-6 sm:size-7 text-gray-600" />
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full py-3 outline-none text-lg"
                  />
                </div>
              </div>

              {mode === "sign-up" && (
                <div className="form-control">
                  <div className="flex items-center gap-3 border-b border-gray-300 focus-within:border-[#02343F]">
                    <Key className="shrink-0 size-6 sm:size-7 text-gray-600" />
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full py-3 outline-none text-lg"
                    />
                  </div>
                </div>
              )}

              {/* Mobile submit */}
              <button
                type="submit"
                className="md:hidden w-full h-12 rounded-xl bg-gray-700 text-white font-semibold hover:bg-[#02343F] transition"
              >
                {mode === "sign-in" ? "Sign in" : "Create account"}
              </button>

              {/* Desktop floating submit */}
              <div className="w-full flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="hidden md:flex  justify-end  bg-gray-600 text-white rounded-full shadow-md hover:bg-[#02343F] transition p-2"
                  aria-label="Submit"
                >
                  <FaArrowAltCircleRight className="size-16" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAuth;
