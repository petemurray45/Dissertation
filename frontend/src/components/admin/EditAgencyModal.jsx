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

function EditAgencyModal({
  initial = {},
  onClose,
  backTo = "/agency/dashboard",
}) {
  const [formData, setFormData] = useState({
    agency_name: "",
    agency_email: "",
    phone: "",
    logo_url: "",
    website: "",
    ...initial,
  });

  const [loginId, setLoginId] = useState({
    current_password: "",
    new_password: "",
  });

  const { updateAgency, deleteAgency, token } = useAgencyStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (initial) {
      setFormData({
        agency_name: initial.agency_name || "",
        agency_email: initial.agency_email || "",
        phone: initial.phone || "",
        logo_url: initial.logo_url || "",
        website: initial.website || "",
      });
    }
  }, [initial]);

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

    try {
      const payload = {
        ...formData,
        ...(loginId.new_password && { ...loginId }),
      };

      await updateAgency(payload, token);
      toast.success("Agency details updated!");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Update error", err);
      toast.error("Something went wrong with the update.");
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete this agency account?")
    ) {
      try {
        await deleteAgency(token);
        toast.success("Agency account deleted!");
        setTimeout(() => {
          onClose();
        }, 1000);
        navigate("/home");
      } catch (err) {
        console.error("Delete error", err);
        toast.error("Something went wrong with the deletion.");
      }
    }
  };

  return (
    <div className="card bg-base-100 w-full relative">
      <Toaster
        position="top-center"
        containerClassName="!absolute !top-0"
        toastOptions={{
          style: {
            borderRadius: "8px",
            background: "#333",
            color: "#fff",
            fontSize: "1.2rem",
            padding: "1rem 1.5rem",
            width: "full",
          },
        }}
      />
      <div className="w-full flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={() => navigate(backTo)}
          className="btn btn-ghost"
        >
          <ArrowLeftIcon className="size-4 mr-2" />
          Back to Dashboard
        </button>
        {onClose && (
          <button type="button" onClick={onClose} className="btn">
            Close
          </button>
        )}
      </div>

      <div className="card-body border-2 rounded-2xl">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Update Agency Details
        </h2>
        <form
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-7 items-start"
          onSubmit={handleSubmit}
        >
          {/* Agency Details */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium">
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
                placeholder="Enter agency name"
                className="input pl-10 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full"
                value={formData.agency_name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <Mail className="size-5" />
              </div>
              <input
                type="email"
                name="agency_email"
                placeholder="Enter email"
                className="input pl-10 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full"
                value={formData.agency_email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium">Phone</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <Phone className="size-5" />
              </div>
              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                className="input pl-10 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium">Website</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <Link className="size-5" />
              </div>
              <input
                type="text"
                name="website"
                placeholder="Enter website URL"
                className="input pl-10 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium">Logo URL</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <Image className="size-5" />
              </div>
              <input
                type="text"
                name="logo_url"
                placeholder="Enter logo URL"
                className="input pl-10 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full"
                value={formData.logo_url}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password Update Section */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mt-4 mb-2">Update Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
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
                    placeholder="Enter current password"
                    className="input pl-10 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full"
                    value={loginId.current_password}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
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
                    placeholder="Enter new password"
                    className="input pl-10 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full"
                    value={loginId.new_password}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="col-span-2 flex justify-between items-center mt-6">
            <button type="submit" className="btn btn-primary">
              <SaveIcon className="size-5 mr-2" />
              Save Changes
            </button>
            <button
              type="button"
              className="btn btn-error"
              onClick={handleDelete}
            >
              <Trash2Icon className="size-5 mr-2" />
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditAgencyModal;
