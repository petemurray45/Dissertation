import { useState } from "react";
import { UserRound, Key } from "lucide-react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { AtSign } from "lucide-react";
import { useUserStore } from "../../../utils/useUserStore";
import { useNavigate } from "react-router-dom";

function UserAuth() {
  const [mode, setmode] = useState("sign-in");
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
      className="h-screen w-full flex justify-center items-center"
      style={{
        backgroundImage: `linear-gradient(to right top, #ffffff, #d3d4d9, #a5abb5, #778491, #49606e, #435f6c, #3e5e69, #395d66, #5d7d85, #829fa6, #a9c3c8, #d1e7eb)`,
      }}
    >
      <div className="relative h-[800px] w-[650px] bg-white  rounded-2xl shadow-2xl">
        <div className="flex flex-col justify-end bg-[url('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] h-[45%] w-full rounded-tl-2xl rounded-tr-2xl bg-cover">
          <h1 className="flex flex-col  flex-reverse text-8xl text-white font-extrabold pl-4 pb-4 shadow-2xl">
            Hello
          </h1>
        </div>
        {/* Tabs */}
        <div className="flex justify-center gap-20 mt-8">
          <button
            type="submit"
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
            type="submit"
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

        {mode === "sign-in" ? (
          <div className=" flex justify-center w-full h-auto">
            <div className="flex w-full h-[20rem] justify-center">
              <form id="signin-form" onSubmit={handleSubmit}>
                <div className="form-control">
                  <div>
                    <div className="w-[500px] px-9 flex items-center  mt-12">
                      <UserRound className="size-10 mr-6" />
                      <input
                        type="email"
                        required
                        placeholder="Enter email"
                        data-testid="user-email"
                        onInvalid={(e) =>
                          setValidity(
                            e.currentTarget,
                            e.currentTarget.validity.typeMismatch
                              ? "Please enter a valid email"
                              : "Email is required"
                          )
                        }
                        onInput={clearCustomValidity}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        required
                        minLength={6}
                        placeholder="Enter password"
                        data-testid="user-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onInvalid={(e) =>
                          setValidity(
                            e.currentTarget,
                            e.currentTarget.validity.valueMissing
                              ? "Password is required"
                              : "Password must be at least 6 characters"
                          )
                        }
                        onInput={clearCustomValidity}
                        className="p-3 border-b-2 border-b-gray-300 pl-10 py-transition-colors  focus:outline-none focus:border-b-2 focus:ring-0   w-full text-2xl"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  aria-label="Sign-in"
                  data-testid="user-login-submit"
                  className="absolute bottom-12 -right-14 bg-gray-600 text-white p-3 rounded-full shadow-md  hover:bg-[#02343F] hover:border-black"
                >
                  <FaArrowAltCircleRight className="size-24 shadow-2xl" />
                </button>
              </form>
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
                        placeholder="Enter full name"
                        required
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        onInvalid={(e) =>
                          setValidity(e.currentTarget, "Full name is required")
                        }
                        onInput={clearCustomValidity}
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
                        type="email"
                        required
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onInvalid={(e) =>
                          setValidity(
                            e.currentTarget,
                            e.currentTarget.validity.typeMismatch
                              ? "Please enter a valid email"
                              : "Email is required"
                          )
                        }
                        onInput={clearCustomValidity}
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
                        type="password"
                        placeholder="Enter password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onInvalid={(e) =>
                          setValidity(
                            e.currentTarget,
                            e.currentTarget.validity.valueMissing
                              ? "Password is required"
                              : "Password must be at least 6 characters"
                          )
                        }
                        onInput={clearCustomValidity}
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
                        placeholder="Confirm password"
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onInvalid={(e) =>
                          setValidity(
                            e.currentTarget,
                            e.currentTarget.validity.valueMissing
                              ? "Please confirm your password"
                              : "Must be at least 6 characters"
                          )
                        }
                        onInput={clearCustomValidity}
                        className="p-3 border-b-2 border-b-gray-300 pl-10 py-transition-colors focus:outline-none focus:border-b-2 focus:ring-0  w-full text-2xl"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full text-center mt-[6rem] mb-[2rem]"></div>
                <button
                  type="submit"
                  aria-label="Sign-in"
                  className="absolute bottom-12 -right-14 bg-gray-600 text-white p-3 rounded-full shadow-md hover:bg-[#02343F] hover:border-black"
                >
                  <FaArrowAltCircleRight className="size-24 shadow-2xl" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserAuth;
