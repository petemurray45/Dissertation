import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa6";
import searchIcon from "../../assets/search.png";

function LoginHero() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-start   h-full w-full my-10 mb-20">
      <div className="bg-[#02343F] h-[30rem] w-full  border-2 rounded-tr-2xl rounded-br-2xl shadow-2xl"></div>
      <div className="flex flex-col justify-center h-[30rem]] bg-gray-100 w-[50%] border-1 ml-10 rounded-bl-2xl rounded-tl-2xl px-10 shadow-2xl">
        <button
          className="btn rounded-2xl bg-[#02343F] text-white text-xl hover:bg-[#f0edcc] hover:text-black hover:border-black  w-full h-[5rem]"
          onClick={() => navigate("/login")}
        >
          LOG IN
        </button>
        <div className="divider text-lg font-bold">OR</div>
        <button
          className="btn rounded-2xl bg-[#02343F] text-white text-xl hover:bg-[#f0edcc] hover:text-black hover:border-black w-full h-[5rem]"
          onClick={() => navigate("/login")}
        >
          SIGN UP
        </button>
      </div>
    </div>
  );
}

export default LoginHero;
