import { useUserStore } from "../../../utils/useUserStore";
import { useListingStore } from "../../../utils/useListingsStore";
import { useState, useEffect, useRef } from "react";
import { MdAlternateEmail } from "react-icons/md";
import { CiTextAlignJustify } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { Toaster, toast } from "react-hot-toast";

function EnquireForm({ property }) {
  const { user } = useUserStore();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { addEnquiry } = useListingStore();

  const isTestMode =
    typeof window !== "undefined" && localStorage.getItem("E2E") === "1";

  const emailInputRef = useRef(null);
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setName(user.name);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if disabled by useer logging in in non-test mode validate the stored user email
    const emailDisabled = emailInputRef.current?.disabled ?? false;

    // chose email depending on logged in state
    const emailToCheck = !user || isTestMode ? email : user?.email ?? "";

    // regex validation
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToCheck);

    if (!isValidEmail) {
      toast.error(
        <span data-testid="toast-invalid-email">
          Please enter a valid email address
        </span>
      );
      return; // stop submission
    }

    try {
      const payload = {
        property_id: property.id,
        full_name: user?.name ?? name,
        email: emailToCheck,
        message: message?.trim(),
        ...(user && { user_id: user.id }),
      };
      const res = await addEnquiry(payload);
      toast.success(
        <span data-testid="toast-enquiry-sent">
          Enquiry Submitted! You should receive a confirmation email shortly.
        </span>
      );
      setSubmitted(true);
      console.log("Enquiry submitted");
    } catch (err) {
      console.log("Failed to submit enquiry form", err);
      toast.error("Error submitting enquiry.");
    }
  };

  return (
    <div
      className="bg-gray-300 px-2 py-2 rounded-2xl"
      data-testid="enquiry-modal"
    >
      <div className=" bg-gray-100 px-8 py-8 font-raleway rounded-2xl relative">
        <Toaster
          position="top-center"
          containerClassName="!absolute !top-0"
          toastOptions={{
            style: {
              borderRadius: "8px",
              background: "#333",
              color: "#fff",
              fontSize: "1.2rem",
              padding: "1rem 1.5rem",
              width: "full",
            },
          }}
        />
        <h1 className="sm:text-2xl md:text-4xl text-gray-600">
          Make an enquiry by filling out our enquiry request form below.
        </h1>

        <form className="grid grid-cols-1 mt-10 gap-10" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label flex">
              <span className="sm:text-xl md:text-3xl mb-2 text-gray-600">
                Full Name:
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/50">
                <CiUser size={24} />
              </div>
              <input
                className="input py-1 focus:input-primary transition-colors duration-200 input-bordered w-[30%] px-12 sm:h-12 md:h-16 sm:text-xl md:text-2xl"
                data-testid="enquiry-name"
                value={user ? user.name : name}
                disabled={!isTestMode && user}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label flex">
              <span className="sm:text-xl md:text-3xl text-gray-600">
                Your email:
              </span>
            </label>
            <div className="relative items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                <MdAlternateEmail size={24} />
              </div>
              {!user ? (
                <input
                  data-testid="enquiry-email"
                  className="input pl-10 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full px-12 sm:h-12 md:h-16"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              ) : (
                <input
                  data-testid="enquiry-email"
                  className="input pl-12 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full px-12 sm:h-12 md:h-16 md:text-2xl sm:text-xl text-gray-800"
                  disabled={!isTestMode && user}
                  type="text"
                  value={!isTestMode && user ? user.email : email}
                />
              )}
            </div>
          </div>

          <div className="form-control">
            <label className="label flex">
              <span className="sm:text-xl md:text-3xl mb-2 text-gray-600">
                Message:
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <CiTextAlignJustify size={24} />
              </div>
              <textarea
                className="textarea textarea-bordered w-full px-12 py-5 sm:text-xl md:text-2xl resize-none h-52 md:h-80"
                data-testid="enquiry-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
              />
            </div>
          </div>

          <div className="flex w-full justify-end">
            <button
              type="submit"
              data-testid="enquiry-submit"
              className="w-24 md:w-44 h-12 md:h-16 rounded-md bg-[#02343F] text-white md:text-2xl sm:text-xl hover:bg-[#F0EDCC] hover:text-black"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EnquireForm;
