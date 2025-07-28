import Overview from "./Overview";
import LikedProperties from "./LikedProperties";
import { useState } from "react";
import { FaCamera } from "react-icons/fa";
import { useUserStore } from "../../../utils/useUserStore";

function EditProfile() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useUserStore();

  return (
    <>
      <h1 className="text-5xl font-raleway text-gray-200 mx-20 gap-10">
        Edit Profile
      </h1>
      <div className="flex flex-wrap justify-between items-stretch mx-10 text-white font-raleway text-lg sm:text-xl md:text-2xl"></div>
      <div className="grid grid-cols-3  gap-20  mx-20 font-raleway">
        <div className="col-span-2  rounded-lg mt-10">
          <form className="grid grid-cols-1 gap-5">
            <div className="flex justify-center gap-20">
              <div className="h-56 w-96 border-2 rounded-3xl"></div>
              <div className="flex items-center justify-center w-full h-56 border-dashed border-4 bg-gray-100 rounded-lg">
                <div className="flex flex-col justify-center items-center gap-3 w-full">
                  <h1 className="text-2xl text-gray-200">
                    Upload a Profile Photo
                  </h1>
                  <FaCamera size={28} />
                </div>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-2xl text-gray-400">Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50"></div>
                <input
                  type="text"
                  placeholder="Joe Bloggs"
                  className="border-2 rounded-md pl-10 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full h-16 text-2xl text-gray-400"
                  value={user.name}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-2xl text-gray-400">
                  Email Address
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50"></div>
                <input
                  type="email"
                  placeholder="me@propertyapp.com"
                  className="border-2 rounded-md pl-10 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full h-16 text-2xl text-gray-400"
                  value={user.email}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-20">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-2xl text-gray-400">
                    New Password
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50"></div>
                  <input
                    type="password"
                    className="border-2 rounded-md pl-10 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full h-16 text-2xl"
                    value={(e) => (value = e.target.value)}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-2xl text-gray-400">
                    Confirm New Password
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50"></div>
                  <input
                    type="password"
                    className="border-2 rounded-md pl-10 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full h-16 text-2xl"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="border-2 rounded-2xl mt-10"></div>
      </div>
    </>
  );
}

export default EditProfile;
