import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { FaCamera } from "react-icons/fa";
import { useUserStore } from "../../../utils/useUserStore";
import { Toaster, toast } from "react-hot-toast";

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
      toast.success("Profile updated!");

      if (updated?.photoUrl) setPreview(updated.photoUrl);
      console.log("Profile updated successfully");
    } catch (err) {
      console.log("Failed to update profile", err);
      toast.error("Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl md:text-5xl font-raleway text-gray-200 mx-10 md:mx-20 ">
        Edit Profile
      </h1>

      <div className="bg-gray-300 mx-5 md:mx-20 my-6 md:my-10 p-2 md:p-4 rounded-2xl relative">
        <Toaster
          position="top-center"
          containerClassName="!absolute !top-0"
          toastOptions={{
            style: {
              borderRadius: "8px",
              background: "#333",
              color: "#fff",
              fontSize: "1rem",
              padding: "0.75rem 1rem",
            },
          }}
        />

        {/* CARD */}
        <div className="bg-gray-100 font-raleway rounded-xl p-4 md:p-8 px-5">
          <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
            {/* PHOTO PICKER ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
              {/* Preview */}
              <div className="w-full">
                <div className="aspect-[3/2] w-full max-w-xl mx-auto overflow-hidden rounded-2xl border">
                  {preview && (
                    <img
                      src={preview}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Upload button */}
              <button
                type="button"
                className="w-full max-w-xl mx-auto flex items-center justify-center rounded-2xl border-4 border-dashed border-gray-300 bg-gray-200 p-8 hover:bg-gray-100"
                onClick={() => fileRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <h2 className="text-lg md:text-2xl text-gray-600">
                    Upload a Profile Photo
                  </h2>
                  <FaCamera className="text-2xl md:text-3xl text-gray-600" />
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

            {/* NAME */}
            <div>
              <label className="block text-base md:text-xl text-gray-500 mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder={user?.name || "Your name"}
                className="w-full rounded-md border-2 px-3 py-3 md:py-4 text-base md:text-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#02343F]/30"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-base md:text-xl text-gray-500 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="me@propertyapp.com"
                className="w-full rounded-md border-2 px-3 py-3 md:py-4 text-base md:text-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#02343F]/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORDS + SUBMIT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div>
                <label className="block text-base md:text-xl text-gray-500 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-md border-2 px-3 py-3 md:py-4 text-base md:text-xl focus:outline-none focus:ring-2 focus:ring-[#02343F]/30"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-base md:text-xl text-gray-500 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-md border-2 px-3 py-3 md:py-4 text-base md:text-xl focus:outline-none focus:ring-2 focus:ring-[#02343F]/30"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="flex items-end">
                <button
                  className="w-full md:w-auto btn rounded-md bg-[#02343F] text-gray-100 h-12 md:h-16 text-lg md:text-2xl px-6"
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
    </>
  );
}

export default EditProfile;
