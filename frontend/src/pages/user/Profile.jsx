import NavBar from "../../components/user/NavBar";
import { useUserStore } from "../../utils/useUserStore";
import { useState } from "react";
import SecondaryNav from "../../components/user/navs/secondaryNav";
import Overview from "../../components/user/profile/Overview";
import LikedProperties from "../../components/user/profile/LikedProperties";
import EditProfile from "../../components/user/profile/EditProfile";

function Profile() {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState("overview");

  const tabComponents = {
    overview: <Overview />,
    likedProperties: <LikedProperties />,
    edit: <EditProfile />,
  };

  const tabSelectors = [
    { key: "overview", label: "Overview" },
    { key: "likedProperties", label: "Liked Properties" },
    { key: "saved", label: "Saved Searches" },
    { key: "edit", label: "Edit Profile" },
    { key: "notes", label: "Notes" },
  ];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to right top, #ffffff, #d3d4d9, #a5abb5, #778491, #49606e, #435f6c, #3e5e69, #395d66, #5d7d85, #829fa6, #a9c3c8, #d1e7eb)`,
      }}
    >
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

        <SecondaryNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabSelectors}
        />

        <div className="p-10">
          {activeTab === "overview" && <Overview />}
          {activeTab === "likedProperties" && <LikedProperties />}
          {activeTab === "edit" && <EditProfile />}
        </div>
      </div>
    </div>
  );
}

export default Profile;
