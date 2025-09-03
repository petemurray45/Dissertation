import { useState, useEffect } from "react";
import {
  ArrowLeftIcon,
  House,
  PoundSterling,
  BedDouble,
  MapPinPlusInside,
  PlusCircleIcon,
  ImageIcon,
  Dog,
  Wifi,
  Toilet,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";

import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import LocationAutocomplete from "./LocationAutocomplete.jsx";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../../utils/useAdminStore.js";
import { useAgencyStore } from "../../utils/useAgencyStore.js";

function PropertyModal({
  initial = {},
  isEdit = false,
  onSubmit,
  showAgencyPicker = false,
  adminToken = null,
  onDelete,
  onClose,
  backTo = "/admin",
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price_per_month: "",
    propertyType: "",
    bedType: "",
    location: "",
    latitude: "",
    longitude: "",
    images: [],
    ...initial,
    // force correct tyoe
    ensuite: typeof initial.ensuite === "boolean" ? initial.ensuite : null,
    wifi: typeof initial.wifi === "boolean" ? initial.wifi : null,
    pets: typeof initial.pets === "boolean" ? initial.pets : null,
  });

  const { token } = useAdminStore();
  const { agencies, agenciesLoading, agenciesError, fetchAgencies } =
    useAgencyStore();

  const navigate = useNavigate();
  const submitLabel = isEdit ? "Save changes" : "Add Property";

  const isTestMode =
    typeof window !== "undefined" && localStorage.getItem("E2E") === "1";

  // hydrate form when initial changes
  const [selectedAgencyId, setSelectedAgencyId] = useState(
    initial?.agency_id ? String(initial.agency_id) : ""
  );

  // fetch agencies if we need the picker
  useEffect(() => {
    if (showAgencyPicker) {
      fetchAgencies(adminToken || token);
    }
  }, [showAgencyPicker, adminToken, token, fetchAgencies]);

  const uploadImagestoCloudinary = async (files) => {
    const uploadPromises = files.map(async (file) => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "property-app");
      fd.append("cloud_name", "dnldppxxg");
      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dnldppxxg/image/upload",
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        return res.data.secure_url;
      } catch (err) {
        console.log("Error with cloudinary image upload", err);
        return null;
      }
    });
    const results = await Promise.all(uploadPromises);
    return results.filter(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (showAgencyPicker && !selectedAgencyId) {
      toast.error("Please choose an agency");
      return;
    }

    const finalPayload = {
      ...formData,
      price_per_month: Number(formData.price_per_month),
      ...(showAgencyPicker ? { agency_id: Number(selectedAgencyId) } : {}),
    };

    try {
      await onSubmit(finalPayload);
      // one toast only, with a stable id for de-duping
      toast.success(
        <span data-testid="toast-prop-saved">
          {isEdit ? "Property updated!" : "Property added!"}
        </span>,
        { id: "prop-save" }
      );
      // give the toast time to render before we unmount this component
      setTimeout(() => {
        onClose?.();
        navigate(backTo);
      }, 1200); // 1.2s is enough for UX + tests
    } catch (err) {
      console.error("Submit error", err);
      toast.error("Something went wrong");
    }
  };

  const handleDeleteImage = (index) =>
    setFormData((p) => ({
      ...p,
      images: p.images.filter((_, i) => i !== index),
    }));

  // validate price string and disbale if not a number
  const priceStr = String(formData.price_per_month ?? "").trim();
  const priceValid = /^\d+(\.\d{1,2})?$/.test(priceStr);

  return (
    <div
      className="card bg-base-100 w-full max-w-[1100px] mx-auto px-3 sm:px-6"
      data-testid="agency-property-modal"
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
        }}
      />

      {/* header */}
      <div className="w-full flex items-center justify-between py-3">
        {onClose && (
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Close
          </button>
        )}
      </div>

      <div className="card-body border-2 rounded-2xl p-4 sm:p-6 lg:p-8">
        {/* Images preview */}
        <div className="mt-2">
          {Array.isArray(formData.images) && formData.images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {formData.images.map((img, index) => (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden aspect-[4/3] w-full shadow-lg"
                >
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-2 right-2 z-10 bg-white/90 text-black font-bold rounded-full w-7 h-7 flex items-center justify-center shadow hover:bg-red-100"
                  >
                    ×
                  </button>
                  <img
                    src={typeof img === "string" ? img : img.url}
                    alt={`Property Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-28 sm:h-32 flex items-center justify-center text-gray-500 border rounded-md">
              Images will appear here
            </div>
          )}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {/* ——— field blocks (unchanged content) ——— */}
          {/* shrink inputs a bit on mobile with h-11 and smaller text */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm sm:text-base font-medium">
                Property Title
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <House className="size-5" />
              </div>
              <input
                name="title"
                aria-label="Property Title"
                data-testid="prop-title"
                type="text"
                placeholder="Enter property title"
                className="input input-bordered w-full pl-10 h-11 sm:h-12 text-sm sm:text-base"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm sm:text-base font-medium">
                Price
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <PoundSterling className="size-5" />
              </div>
              <input
                name="price"
                aria-label="Price per month"
                data-testid="prop-price"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter property price"
                className="input input-bordered w-full pl-10 h-11 sm:h-12 text-sm sm:text-base"
                value={formData.price_per_month}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price_per_month: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Property Type */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm sm:text-base font-medium">
                Property Type
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <PoundSterling className="size-5" />
              </div>
              <select
                name="type"
                aria-label="Property Type"
                data-testid="prop-type"
                className="select select-bordered w-full pl-10 h-11 sm:h-12 text-sm sm:text-base"
                value={formData.propertyType || ""}
                onChange={(e) =>
                  setFormData({ ...formData, propertyType: e.target.value })
                }
              >
                <option disabled value=""></option>
                <option value="Bungalow">Bungalow</option>
                <option value="Semi Detached">Semi Detached</option>
                <option value="Detached">Detached</option>
                <option value="Terraced">Terraced</option>
                <option value="Flat">Flat</option>
                <option value="Cottage">Cottage</option>
              </select>
            </div>
          </div>

          {/* Bed Type */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm sm:text-base font-medium">
                Bed Type
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <BedDouble className="size-5" />
              </div>
              <select
                name="bed type"
                aria-label="Bed type"
                data-testid="bed-type"
                className="select select-bordered w-full pl-10 h-11 sm:h-12 text-sm sm:text-base"
                value={formData.bedType || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bedType: e.target.value })
                }
              >
                <option disabled value=""></option>
                <option value="Double">Double</option>
                <option value="Single">Single</option>
                <option value="Bunk">Bunk Bed</option>
                <option value="Queen">Queen</option>
                <option value="King">King</option>
              </select>
            </div>
          </div>

          {/* Ensuite */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm sm:text-base font-medium">
                En Suite
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <Toilet className="size-5" />
              </div>
              <select
                name="ensuite"
                aria-label="ensuite"
                data-testid="en-suite"
                className="select select-bordered w-full pl-10 h-11 sm:h-12 text-sm sm:text-base"
                value={
                  formData.ensuite === null ? "" : String(formData.ensuite)
                }
                onChange={(e) => {
                  const v = e.target.value;
                  setFormData({
                    ...formData,
                    ensuite: v === "" ? null : v === "true",
                  });
                }}
              >
                <option disabled value=""></option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          {/* Wifi */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm sm:text-base font-medium">
                Wifi
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <Wifi className="size-5" />
              </div>
              <select
                name="wifi"
                aria-label="wifi"
                data-testid="wifi"
                className="select select-bordered w-full pl-10 h-11 sm:h-12 text-sm sm:text-base"
                value={formData.wifi === null ? "" : String(formData.wifi)}
                onChange={(e) => {
                  const v = e.target.value;
                  setFormData({
                    ...formData,
                    wifi: v === "" ? null : v === "true",
                  });
                }}
              >
                <option disabled value=""></option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          {/* Pets */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm sm:text-base font-medium">
                Pets
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <Dog className="size-5" />
              </div>
              <select
                name="pets"
                aria-label="pets"
                data-testid="pets"
                className="select select-bordered w-full pl-10 h-11 sm:h-12 text-sm sm:text-base"
                value={formData.pets === null ? "" : String(formData.pets)}
                onChange={(e) => {
                  const v = e.target.value;
                  setFormData({
                    ...formData,
                    pets: v === "" ? null : v === "true",
                  });
                }}
              >
                <option disabled value=""></option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="form-control sm:col-span-2 lg:col-span-3">
            <label className="label">
              <span className="label-text text-sm sm:text-base font-medium">
                Location
              </span>
            </label>
            <div className="relative z-[40]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <MapPinPlusInside className="size-5" />
              </div>
              {isTestMode ? (
                <input
                  name="location"
                  aria-label="Location"
                  placeholder="Enter location"
                  data-testid="prop-location"
                  className="input input-bordered w-full pl-10 h-11 sm:h-12 text-sm sm:text-base"
                  value={formData.location || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: e.target.value,
                      latitude: 53.4808,
                      longitude: -2.2426,
                    })
                  }
                />
              ) : (
                <div className="pl-10">
                  <LocationAutocomplete
                    onPlaceSelect={({ location, latitude, longitude }) =>
                      setFormData((prev) => ({
                        ...prev,
                        location,
                        latitude,
                        longitude,
                      }))
                    }
                  />
                </div>
              )}
            </div>
          </div>

          {/* Upload */}
          <div className="form-control sm:col-span-2 lg:col-span-3">
            <label className="label">
              <span className="label-text text-sm sm:text-base font-medium">
                Upload Images
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <ImageIcon className="size-5" />
              </div>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full pl-10 h-11 sm:h-12 text-sm sm:text-base"
                onChange={async (e) => {
                  if (isTestMode) return;
                  const filesArray = Array.from(e.target.files);
                  const uploadedUrls = await uploadImagestoCloudinary(
                    filesArray
                  );
                  setFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, ...uploadedUrls],
                  }));
                }}
                data-testid="prop-image-file"
              />
            </div>

            {isTestMode && (
              <div className="mt-2 flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  aria-label="Image URL"
                  placeholder="Paste image URL"
                  data-testid="prop-image-url"
                  className="input input-bordered w-full h-11 sm:h-12 text-sm sm:text-base"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value) {
                      setFormData((p) => ({
                        ...p,
                        images: [...p.images, e.currentTarget.value],
                      }));
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn"
                  data-testid="add-image-url"
                  onClick={() => {
                    const el = document.querySelector(
                      "[data-testid='prop-image-url']"
                    );
                    if (el?.value) {
                      setFormData((p) => ({
                        ...p,
                        images: [...p.images, el.value],
                      }));
                      el.value = "";
                    }
                  }}
                >
                  Add URL
                </button>
              </div>
            )}
          </div>

          {/* Description spans full width */}
          <div className="form-control sm:col-span-2 lg:col-span-3">
            <label className="label">
              <span className="label-text text-sm sm:text-base font-medium">
                Property Description
              </span>
            </label>
            <textarea
              aria-label="Property Description"
              data-testid="prop-description"
              className="textarea textarea-bordered w-full h-32 sm:h-36 text-sm sm:text-base"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Actions */}
          <div className="sm:col-span-2 lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              {showAgencyPicker && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="label m-0 whitespace-nowrap">
                    <span className="label-text text-sm sm:text-base font-medium">
                      Assign to Agency
                    </span>
                  </label>
                  {agenciesLoading ? (
                    <div className="text-sm text-gray-500">
                      Loading agencies…
                    </div>
                  ) : agenciesError ? (
                    <div className="text-sm text-red-600">{agenciesError}</div>
                  ) : (
                    <select
                      aria-label="Assign to Agency"
                      data-testid="assign-agency"
                      className="select select-bordered w-full sm:w-auto"
                      value={selectedAgencyId}
                      onChange={(e) => setSelectedAgencyId(e.target.value)}
                    >
                      <option value="" disabled>
                        Select an agency…
                      </option>
                      {Array.isArray(agencies) &&
                        agencies.map((a) => (
                          <option
                            key={a.id}
                            value={a.id}
                            data-testid={`agency-option-${a.id}`}
                          >
                            {a.agency_name}
                            {a.website ? ` — ${a.website}` : ""}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <button
                  type="submit"
                  aria-label={isEdit ? "Save Property" : "Add Property"}
                  data-testid="submit-property"
                  className="btn btn-primary w-full sm:w-auto"
                  disabled={
                    formData.title === "" ||
                    formData.description === "" ||
                    !priceValid ||
                    formData.bedType === "" ||
                    formData.ensuite === null ||
                    formData.wifi === null ||
                    formData.pets === null ||
                    formData.propertyType === "" ||
                    formData.location === "" ||
                    (showAgencyPicker && !selectedAgencyId)
                  }
                >
                  {isEdit ? (
                    <SaveIcon className="size-5 mr-2" />
                  ) : (
                    <PlusCircleIcon className="size-5 mr-2" />
                  )}
                  {isEdit ? "Save changes" : "Add Property"}
                </button>

                {isEdit && onDelete && (
                  <button
                    type="button"
                    aria-label="Delete Property"
                    data-testid="delete-property"
                    className="btn btn-error w-full sm:w-auto"
                    onClick={onDelete}
                  >
                    <Trash2Icon className="size-5 mr-2" />
                    Delete Property
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PropertyModal;
