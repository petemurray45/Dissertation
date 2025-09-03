import NavBar from "../../components/user/design-components/NavBar";
import { useUserStore } from "../../utils/useUserStore";
import { useState } from "react";
import SecondaryNav from "../../components/user/navs/secondaryNav";
import LikedProperties from "../../components/user/profile/LikedProperties";
import EditProfile from "../../components/user/profile/EditProfile";
import Notes from "../../components/user/profile/Notes";
import Enquiries from "../../components/user/profile/Enquiries";

function Profile() {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState("likedProperties");

  const tabComponents = {
    likedProperties: <LikedProperties />,
    edit: <EditProfile />,
    notes: <Notes />,
    enquiries: <Enquiries />,
  };

  const tabSelectors = [
    { key: "likedProperties", label: "Liked Properties" },
    { key: "edit", label: "Edit Profile" },
    { key: "notes", label: "Notes" },
    { key: "enquiries", label: "Enquiries" },
  ];

  return (
    <div
      className="overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to right top, #ffffff, #d3d4d9, #a5abb5, #778491, #49606e, #435f6c, #3e5e69, #395d66, #5d7d85, #829fa6, #a9c3c8, #d1e7eb)`,
      }}
    >
      <div>
        <NavBar />
        <div className="w-full ">
          <div className="  flex flex-col items-center justify-end bg-cover bg-center">
            <img
              src={user.photoUrl}
              alt="user"
              className="rounded-full object-cover h-64 w-64 mt-20"
            />
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl md:text-6xl text-center text-white font-raleway font-bold text-shadow-lg mt-10">
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

        <div className="relative overflow-hidden min-h-screen">
          {activeTab === "likedProperties" && <LikedProperties />}
          {activeTab === "edit" && <EditProfile />}
          {activeTab === "notes" && <Notes />}
          {activeTab === "enquiries" && <Enquiries />}
        </div>
      </div>
    </div>
  );
}

export default Profile;
