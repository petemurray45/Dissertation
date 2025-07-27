import { CiTextAlignJustify } from "react-icons/ci";
import { useUserStore } from "../../utils/useUserStore";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function MakeNote() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  return (
    <>
      {user ? (
        <div className="flex-col font-raleway text-gray-500">
          <div className="flex-col mt-10">
            <h1 className="text-4xl">
              Something you like about this property?
            </h1>
            <p className="text-3xl pt-5">Why not make a note for later.</p>
          </div>
          <form className="grid grid-cols-1 gap-10">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <CiTextAlignJustify size={24} />
              </div>
              <textarea className="textarea textarea-bordered w-full px-12 py-5 sm:text-xl mt-10 md:text-2xl resize-none h-52 md:h-80"></textarea>
            </div>
            <div className="w-full flex justify-end">
              <button
                className="sm:w-36 md:w-44 sm:h-12 md:h-16 rounded-md bg-[#02343F] text-white md:text-2xl sm:text-xl hover:bg-[#F0EDCC] hover:text-black"
                type="submit"
              >
                Save Note
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex w-full justify-center font-raleway text-gray-500 pt-32">
          <div>
            <h1 className="text-4xl text-center">
              Something you like about this property you wish to make a note of?
            </h1>
            <p className="text-3xl pt-5 text-center">
              Create an acount or log in now to access this feature.
            </p>
            <div className="flex w-full justify-center pt-10">
              <button
                className="w-52 h-16 rounded-md bg-[#02343F] text-white hover:bg-[#F0EDCC] hover:text-black text-3xl flex justify-center items-center gap-4"
                onClick={() => navigate("/login")}
              >
                Log in <FaArrowRight size={26} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MakeNote;
