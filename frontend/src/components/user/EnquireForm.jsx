import { useUserStore } from "../../utils/useUserStore";
import { useListingStore } from "../../utils/useListingsStore";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setName(user.full_name);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        property_id: property.id,
        full_name: name,
        email: email,
        message: message,
        ...(user && { user_id: user.id }),
      };
      const res = await addEnquiry(payload);
      toast.success(
        "Enquiry Submitted! You should recieve a confirmation email shortly."
      );
      setSubmitted(true);
      console.log("Enquiry submitted");
    } catch (err) {
      console.log("Failed to submit enquiry form", err);
      toast.error("Error submitting enquiry.");
    }
  };

  return (
    <div className="bg-gray-300 px-2 py-2 rounded-2xl">
      <div className=" bg-gray-200 px-8 py-8 font-raleway rounded-2xl relative">
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
                value={user ? user.name : name}
                disabled={user}
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
                  className="input pl-10 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full px-12 sm:h-12 md:h-16"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              ) : (
                <input
                  className="input pl-12 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full px-12 sm:h-12 md:h-16 md:text-2xl sm:text-xl text-gray-800"
                  disabled={user}
                  type="text"
                  value={user.email}
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
              />
            </div>
          </div>

          <div className="flex w-full justify-end">
            <button
              type="submit"
              className="sm:w-36 md:w-44 sm:h-12 md:h-16 rounded-md bg-[#02343F] text-white md:text-2xl sm:text-xl hover:bg-[#F0EDCC] hover:text-black"
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
