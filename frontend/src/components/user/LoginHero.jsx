import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa6";

function LoginHero() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center h-[400px] w-full] bg-[url('https://images.unsplash.com/photo-1568242629525-62b0c3d77fb7?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center shadow-2xl">
      <h1 className="ml-10 text-8xl text-[#02343F]  font-extrabold text-shadow-md">
        Save the rooms you love.
        <FaHeart className="size-10" />
      </h1>
    </div>
  );
}

export default LoginHero;
