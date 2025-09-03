import React, { useState, useEffect } from "react";
import {
  ArrowLeftIcon,
  House,
  Mail,
  Link,
  SaveIcon,
  Trash2Icon,
  Lock,
  Phone,
  Image,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAgencyStore } from "../../utils/useAgencyStore.js";
import { Toaster, toast } from "react-hot-toast";
import { Image as ImageIcon, X } from "lucide-react";
import axios from "axios";

function EditAgencyModal({
  initial = {},
  onClose,
  backTo = "/agency/dashboard",
}) {
  const safeInitial = initial ?? {};
  const [formData, setFormData] = useState({
    agency_name: safeInitial.agency_name ?? "",
    agency_email: safeInitial.agency_email ?? "",
    phone: safeInitial.phone ?? "",
    logo_url:
      typeof safeInitial.logo_url === "string" ? safeInitial.logo_url : "",
    website: safeInitial.website ?? "",
  });

  const [loginId, setLoginId] = useState({
    current_password: "",
    new_password: "",
  });

  const { updateAgency, deleteAgency, token } = useAgencyStore();
  const navigate = useNavigate();

  useEffect(() => {
    const i = initial ?? {};
    setFormData((prev) => ({
      agency_name: i.agency_name ?? prev.agency_name,
      agency_email: i.agency_email ?? prev.agency_email,
      phone: i.phone ?? prev.phone,
      logo_url:
        typeof i.logo_url === "string" && i.logo_url.trim() !== ""
          ? i.logo_url
          : prev.logo_url,
      website: i.website ?? prev.website,
    }));
  }, [initial]);

  const uploadLogoToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "property-app");
    fd.append("cloud_name", "dnldppxxg");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dnldppxxg/image/upload",
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return res.data.secure_url;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setLoginId((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agency_email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error(
        <span data-testid="toast-invalid-email">
          Please enter a valid email address
        </span>
      );
      return;
    }

    if (!formData.phone.match(/^[0-9\s\-\+]{7,15}$/)) {
      toast.error(
        <span data-testid="toast-invalid-phone">
          Please enter a valid phone number
        </span>
      );
      return;
    }

    try {
      const payload = {
        ...formData,
        ...(loginId.new_password && {
          current_login_id_hash: loginId.current_password,
          new_login_id_hash: loginId.new_password,
        }),
      };
      console.log("Submitting payload:", payload);
      await updateAgency(payload, token);
      toast.success(
        <span data-testid="toast-agency-saved">Agency details updated!</span>
      );
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Update error", err);
      if (
        err?.response?.status === 401 ||
        err?.message?.includes("invalid current login id")
      ) {
        toast.error(
          <span data-testid="toast-invalid-loginid">
            Current Login ID is incorrect
          </span>
        );
      } else {
        toast.error("Something went wrong with the update.");
      }
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete this agency account?")
    ) {
      try {
        await deleteAgency();
        toast.success(
          <span data-testid="toast-agency-deleted">Agency Deleted!</span>
        );
        setTimeout(() => {
          navigate("/home", { replace: true });
        }, 600);
      } catch (err) {
        console.error(
          "Delete error",
          err?.response?.status,
          err?.response?.data
        );
        toast.error("Something went wrong with the deletion.");
      }
    }
  };

  return (
    <div
      className="card bg-base-100 w-full max-w-[900px] mx-auto px-3 sm:px-6 relative"
      data-testid="agency-edit-modal"
    >
      <Toaster
        position="top-center"
        containerClassName="!absolute !top-0"
        toastOptions={{
          style: {
            borderRadius: "8px",
            background: "#333",
            color: "#fff",
            fontSize: "1.1rem",
            padding: "0.8rem 1.2rem",
            width: "full",
          },
          duration: 4000,
        }}
      />

      {/* Header */}
      <div className="w-full flex items-center justify-between py-3">
        <button
          type="button"
          data-testid="agency-back"
          onClick={onClose}
          className="btn btn-ghost"
        >
          <ArrowLeftIcon className="size-4 mr-2" /> Back to Dashboard
        </button>
        {onClose && (
          <button
            type="button"
            data-testid="agency-close"
            onClick={onClose}
            className="btn"
          >
            Close
          </button>
        )}
      </div>

      <div className="card-body border-2 rounded-2xl p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center">
          Update Agency Details
        </h2>

        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Agency Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm sm:text-base font-medium">
                Agency Name
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <House className="size-5" />
              </div>
              <input
                type="text"
                name="agency_name"
                data-testid="agency-edit-name"
                placeholder="Enter agency name"
                className="input input-bordered w-full pl-10 h-11 sm:h-12 text-sm sm:text-base"
                value={formData.agency_name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm sm:text-base font-medium">
                Email
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <Mail className="size-5" />
              </div>
              <input
                type="email"
                name="agency_email"
                data-testid="agency-edit-email"
                placeholder="Enter email"
                className="input input-bordered w-full pl-10 h-11 sm:h-12 text-sm sm:text-base"
                value={formData.agency_email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm sm:text-base font-medium">
                Phone
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <Phone className="size-5" />
              </div>
              <input
                type="text"
                name="phone"
                data-testid="agency-edit-phone"
                placeholder="Enter phone number"
                className="input input-bordered w-full pl-10 h-11 sm:h-12 text-sm sm:text-base"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Website */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm sm:text-base font-medium">
                Website
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <Link className="size-5" />
              </div>
              <input
                type="text"
                name="website"
                data-testid="agency-edit-website"
                placeholder="Enter website URL"
                className="input input-bordered w-full pl-10 h-11 sm:h-12 text-sm sm:text-base"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Logo */}
          <div className="form-control sm:col-span-2">
            <label className="label">
              <span className="label-text text-sm sm:text-base font-medium">
                Agency Logo
              </span>
            </label>

            {formData.logo_url ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="avatar">
                  <div className="w-16 h-16 rounded ring ring-offset-2">
                    <img
                      src={formData.logo_url}
                      alt="Agency logo preview"
                      className="object-cover"
                      data-testid="agency-logo-preview"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  data-testid="agency-remove-logo"
                  className="btn btn-sm btn-outline w-full sm:w-auto"
                  onClick={() => setFormData((p) => ({ ...p, logo_url: "" }))}
                >
                  <X className="size-4 mr-1" /> Remove
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <ImageIcon className="size-5" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full pl-10 h-11 sm:h-12 text-sm sm:text-base"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      if (!file.type.startsWith("image/")) {
                        return toast.error("Please select an image file");
                      }
                      const url = await uploadLogoToCloudinary(file);
                      setFormData((p) => ({ ...p, logo_url: url }));
                      toast.success("Logo uploaded");
                    } catch (err) {
                      console.error("Logo upload failed", err);
                      toast.error("Failed to upload logo");
                    } finally {
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            )}

            <div className="mt-2">
              <input
                type="url"
                name="logo_url"
                data-testid="agency-edit-logo-url"
                placeholder="OR enter a logo url"
                className="input input-bordered w-full h-11 sm:h-12 text-sm sm:text-base"
                value={formData.logo_url}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Passwords */}
          <div className="sm:col-span-2">
            <h3 className="text-base sm:text-lg font-semibold mt-2 sm:mt-4 mb-2">
              Update Password
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm sm:text-base font-medium">
                    Current Login ID
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                    <Lock className="size-5" />
                  </div>
                  <input
                    type="password"
                    name="current_password"
                    data-testid="agency-current-loginid"
                    placeholder="Enter current password"
                    className="input input-bordered w-full pl-10 h-11 sm:h-12 text-sm sm:text-base"
                    value={loginId.current_password}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm sm:text-base font-medium">
                    New Login ID
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                    <Lock className="size-5" />
                  </div>
                  <input
                    type="password"
                    name="new_password"
                    data-testid="agency-new-loginid"
                    placeholder="Enter new password"
                    className="input input-bordered w-full pl-10 h-11 sm:h-12 text-sm sm:text-base"
                    value={loginId.new_password}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="sm:col-span-2 mt-4 sm:mt-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between">
              <button
                type="submit"
                className="btn btn-primary w-full sm:w-auto"
                data-testid="agency-save"
              >
                <SaveIcon className="size-5 mr-2" /> Save Changes
              </button>
              <button
                type="button"
                data-testid="agency-delete"
                className="btn btn-error w-full sm:w-auto"
                onClick={handleDelete}
              >
                <Trash2Icon className="size-5 mr-2" /> Delete Account
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditAgencyModal;
