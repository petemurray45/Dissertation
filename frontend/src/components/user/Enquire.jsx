import { useUserStore } from "../../utils/useUserStore";
import { useState } from "react";
import { MdAlternateEmail } from "react-icons/md";
import { CiTextAlignJustify } from "react-icons/ci";

function Enquire() {
  const { user } = useUserStore();
  const [message, setMessage] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className=" mx-10 mt-10 font-raleway">
      <h1 className="text-4xl">
        Make an enquiry by filling out our enquiry request form below.
      </h1>

      <form className="grid grid-cols-1 mt-10 gap-10">
        <div className="form-control">
          <label className="label flex">
            <span className="sm:text-xl md:text-3xl">Your email:</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
              <MdAlternateEmail />
            </div>
            {!user ? (
              <input
                className="input pl-10 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full px-10 sm:h-12 md:h-16"
                type="text"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
              />
            ) : (
              <input
                className="input pl-12 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full px-10 sm:h-12 md:h-16 md:text-2xl sm:text-xl"
                disabled={user}
                type="text"
                value={user.email}
              />
            )}
          </div>
        </div>

        <div className="form-control">
          <label className="label flex">
            <span className="sm:text-xl md:text-3xl mb-2">Message:</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
              <CiTextAlignJustify />
            </div>
            <textarea
              className="textarea textarea-bordered w-full px-10 py-5 sm:text-xl md:text-2xl resize-none h-52 md:h-80"
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
  );
}

export default Enquire;
