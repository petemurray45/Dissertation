import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { FaCamera } from "react-icons/fa";
import { useUserStore } from "../../../utils/useUserStore";

function EditProfile() {
  const { user, updateProfile } = useUserStore();

  // local state for form fields (read from client shape)
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // image state
  const [preview, setPreview] = useState(user?.photoUrl || "");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    setFullName(user?.name || "");
    setEmail(user?.email || "");
    setPreview(user?.photoUrl || "");
  }, [user]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const uploadToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "property-app");
    formData.append("cloud_name", "dnldppxxg");

    const { data } = await axios.post(
      "https://api.cloudinary.com/v1_1/dnldppxxg/image/upload",
      formData
    );
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setSaving(true);

      let uploadedUrl;
      if (file) {
        uploadedUrl = await uploadToCloudinary(file);
      }

      const payload = {
        full_name: fullName,
        email,
        password: password || undefined,
        photoUrl: uploadedUrl || undefined,
      };

      const updated = await updateProfile(payload);

      setPassword("");
      setConfirmPassword("");
      setFile(null);

      if (updated?.photoUrl) setPreview(updated.photoUrl);
      console.log("Profile updated successfully");
    } catch (err) {
      console.log("Failed to update profile", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h1 className="text-5xl font-raleway text-gray-200 mx-20 ">
        Edit Profile
      </h1>

      <div className="bg-gray-300 mx-20 my-10 py-2 px-2 rounded-2xl">
        <div className="grid grid-cols-2 bg-gray-100 gap-20 font-raleway rounded-xl">
          <div className="col-span-2 rounded-lg px-5 py-5">
            <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
              <div className="flex justify-center gap-20">
                <div className="h-56 w-96 border-2 overflow-hidden rounded-3xl">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>

                <button
                  type="button"
                  className="flex items-center justify-center w-full h-56 border-dashed border-4 border-gray-300 bg-gray-200 rounded-lg"
                  onClick={() => fileRef.current?.click()}
                >
                  <div className="flex flex-col justify-center items-center gap-3 w-full">
                    <h1 className="text-2xl text-gray-500">
                      Upload a Profile Photo
                    </h1>
                    <FaCamera size={28} />
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </button>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-2xl text-gray-500">
                    Name
                  </span>
                </label>
                <input
                  type="text"
                  placeholder={user?.name || "Your name"}
                  className="border-2 rounded-md px-3 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full h-16 text-2xl text-gray-700"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-2xl text-gray-500">
                    Email Address
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="me@propertyapp.com"
                  className="border-2 rounded-md px-3 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full h-16 text-2xl text-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-20 ">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-2xl text-gray-500">
                      New Password
                    </span>
                  </label>
                  <input
                    type="password"
                    className="border-2 rounded-md px-3 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full h-16 text-2xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-2xl text-gray-500">
                      Confirm New Password
                    </span>
                  </label>
                  <input
                    type="password"
                    className="border-2 rounded-md px-3 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full h-16 text-2xl"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <div className="form-control flex h-full justify-end">
                  <button
                    className="btn rounded-md bg-[#02343F] text-gray-100 h-16 text-2xl"
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
