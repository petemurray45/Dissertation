import NavBar from "../../components/user/NavBar";
import { useUserStore } from "../../utils/useUserStore";
import { useState } from "react";
function Profile() {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState("overview");
  return (
    <div className="relative overflow-hidden h-screen">
      <div className="w-full h-[40%] top-0 left-0 z-20 bg-white">
        <NavBar />
        <div className="w-full pt-48">
          <div className="flex flex-col justify-center">
            <h1 className="text-6xl text-center text-white font-raleway font-bold text-shadow-xl">
              Welcome {user.name}!
            </h1>
          </div>
        </div>
        <div className="w-full h-24 bg-[#02343F] px-4 mt-28">
          <div className="flex flex-wrap justify-between items-stretch h-full max-w-6xl mx-auto text-white font-raleway text-lg sm:text-xl md:text-2xl">
            <div className="flex flex-1 items-center justify-center text-3xl hover:bg-white hover:text-[#02343F] h-full">
              Overview
            </div>
            <div className="w-px  bg-white hidden sm:block" />
            <div className="flex flex-1 justify-center items-center text-3xl hover:bg-white hover:text-[#02343F] h-full">
              Liked Properties
            </div>
            <div className="w-px h-full bg-white hidden sm:block" />
            <div className="flex flex-1 justify-center items-center text-3xl hover:bg-white hover:text-[#02343F] h-full">
              Saved Searches
            </div>
            <div className="w-px h-full bg-white hidden sm:block" />

            <div className="flex flex-1 justify-center items-center text-3xl hover:bg-white hover:text-[#02343F] h-full">
              Notes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
