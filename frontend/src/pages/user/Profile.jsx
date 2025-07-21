import NavBar from "../../components/user/NavBar";
import { useUserStore } from "../../utils/useUserStore";
import { useState } from "react";

import Overview from "../../components/user/profile/Overview";
import LikedProperties from "../../components/user/profile/LikedProperties";

function Profile() {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="relative overflow-hidden">
      <div>
        <NavBar />
        <div className="w-full  bg-cover bg-center">
          <div
            className="w-full h-[400px] flex items-center justify-center bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
            }}
          >
            <div className="flex flex-col justify-center">
              <h1 className="text-6xl text-center text-white font-raleway font-bold text-shadow-lg mt-28">
                Welcome {user.name}!
              </h1>
            </div>
          </div>
        </div>

        <div className="w-full h-24 bg-[#02343F] px-4">
          <div className="flex flex-wrap justify-between items-stretch h-full max-w-6xl mx-auto text-white font-raleway text-lg sm:text-xl md:text-2xl">
            <div
              className={`cursor-pointer flex flex-1 items-center justify-center text-3xl hover:bg-white hover:text-[#02343F] h-full ${
                activeTab === "overview"
                  ? "bg-white text-[#02343F]"
                  : "text-white"
              } `}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </div>
            <div className="w-px h-full bg-white hidden sm:block" />
            <div
              className={`cursor-pointer flex px-10 flex-1 justify-center items-center text-3xl hover:bg-white hover:text-[#02343F] h-full whitespace-nowrap ${
                activeTab === "likedProperties"
                  ? "bg-white text-[#02343F]"
                  : "text-white"
              }`}
              onClick={() => setActiveTab("likedProperties")}
            >
              Liked Properties
            </div>
            <div className="w-px h-full bg-white hidden sm:block" />
            <div
              className={`cursor-pointer flex px-10 flex-1 justify-center items-center text-3xl hover:bg-white hover:text-[#02343F] h-full whitespace-nowrap ${
                activeTab === "saved" ? "bg-white text-[#02343F]" : "text-white"
              }`}
              onClick={() => setActiveTab("saved")}
            >
              Saved Searches
            </div>
            <div className="w-px h-full bg-white hidden sm:block" />
            <div
              className={`cursor-pointer flex px-10 flex-1 justify-center items-center text-3xl hover:bg-white hover:text-[#02343F] h-full whitespace-nowrap ${
                activeTab === "edit" ? "bg-white text-[#02343F]" : "text-white"
              }`}
              onClick={() => setActiveTab("edit")}
            >
              Edit Profile
            </div>
            <div className="w-px h-full bg-white hidden sm:block" />
            <div
              className={`cursor-pointer flex flex-1 justify-center items-center text-3xl hover:bg-white hover:text-[#02343F] h-full ${
                activeTab === "notes" ? "bg-white text-[#02343F]" : "text-white"
              }`}
              onClick={() => setActiveTab("notes")}
            >
              Notes
            </div>
          </div>
        </div>

        <div className="p-10">
          {activeTab === "overview" && <Overview />}
          {activeTab === "likedProperties" && <LikedProperties />}
        </div>
      </div>
    </div>
  );
}

export default Profile;
