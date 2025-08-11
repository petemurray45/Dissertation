import React, { useEffect, useState } from "react";
import { useListingStore } from "../../utils/useListingsStore.js";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavBar from "../../components/admin/AdminNavBar";
import LocationAutocomplete from "../../components/admin/LocationAutocomplete";
import { Toaster, toast } from "react-hot-toast";

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
} from "lucide-react";
import axios from "axios";

function AdminProductPage() {
  // data from lisitings store
  const { formData, setFormData, loading, error, addProperty } =
    useListingStore();

  // used to navigate to different route
  const navigate = useNavigate();
  // gets property id from url
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      setFormData({
        title: "",
        description: "",
        price_per_month: "",
        propertyType: "",
        ensuite: "",
        bedType: "",
        wifi: "",
        pets: "",
        location: "",
        latitude: "",
        longitude: "",
        images: [],
      });
    }
  }, [id]);

  const handleDeleteImage = (index) => {
    setFormData({ ...formData, images: [] });
  };

  // handle upload of new images
  const uploadImagestoCloudinary = async (files) => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "property-app");
      formData.append("cloud_name", "dnldppxxg");

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dnldppxxg/image/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return res.data.secure_url;
      } catch (err) {
        console.log("Error with cloudinary image upload", err);
        return null;
      }
    });
    const results = await Promise.all(uploadPromises);
    return results.filter((url) => url !== null);
  };

  // handle form submission
  const handleSubmit = async (e) => {
    console.log("handleSubmit e:", e);
    e.preventDefault();

    try {
      console.log("FORM DATA STATE:", formData);

      const finalPayload = {
        ...formData,
        price_per_month: Number(formData.price_per_month),
      };

      console.log("Sent final payload to backend", finalPayload);

      await addProperty(finalPayload);
      console.log(finalPayload);
      navigate("/");

      toast.success("Property Added!");
    } catch (err) {
      console.log("Error in image upload", err);
      toast.error("Property add failed.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  console.log("formData.images", formData.images);
  console.log(formData);

  return (
    <>
      <AdminNavBar />
      <div className="container mx-auto max-w-7xl px-4 py-6 border border-gray-300 shadow-2xl rounded-xl mb-10 mt-10 font-raleway">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: "8px",
              background: "#333",
              color: "#fff",
              fontSize: "1.2rem",
              padding: "1rem 1.5rem",
            },
          }}
        />
        <button
          type="button"
          onClick={() => navigate("/")}
          className="btn btn-ghost mb-8"
        >
          <ArrowLeftIcon className="size-4 mr-2" />
          Back to dashboard
        </button>

        <div className="flex flex-wrap overflow-hidden sm:grid-cols-2 max-w-4xl mx-auto mt-2 pl-8 pr-8">
          {/*Property Image */}
          {Array.isArray(formData.images) && formData.images.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-hidden">
                {formData.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden aspect-[4/3] w-full max-w-[400px] shadow-lg"
                  >
                    {/* Delete image button */}
                    <button
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-2 right-2 z-10 bg-white text-black-600 font-bold rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-100"
                    >
                      X
                    </button>
                    <img
                      src={typeof img === "string" ? img : img.url}
                      alt={`Property Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        <div className="card bg-base-100 w-full">
          {/*property info */}
          <div className="card-body">
            <h2 className="card-title text-4xl mb-6">Add a Property</h2>

            <form
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-7 items-start"
              onSubmit={handleSubmit}
            >
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    Property Title
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                    <House className="size-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter property title"
                    className="input pl-10 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    Price
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                    <PoundSterling className="size-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter property price"
                    className="input pl-10 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full"
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

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    Property Type
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                    <PoundSterling className="size-5" />
                  </div>

                  <select
                    name="propertyType"
                    className="select select-bordered w-full pl-10"
                    placeholder="Pick a property type"
                    value={formData.propertyType || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, propertyType: e.target.value })
                    }
                  >
                    <option className="font-raleway" disabled selected></option>
                    <option value="Bungalow">Bungalow</option>
                    <option value="Semi Detached">Semi Detached</option>
                    <option value="Detached">Detached</option>
                    <option value="Terraced">Terraced</option>
                    <option value="Flat">Flat</option>
                    <option value="Cottage">Cottage</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    Bed Type
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3  flex items-center pointer-events-none text-base-content/50">
                    <BedDouble className="size-5" />
                  </div>
                  <select
                    name="bedType"
                    className="select select-bordered w-full pl-10"
                    placeholder="Pick a bed type"
                    value={formData.bedType || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, bedType: e.target.value })
                    }
                  >
                    <option
                      value=""
                      className="font-raleway"
                      disabled
                      selected
                    ></option>
                    <option value="Double">Double</option>
                    <option value="Single">Single</option>
                    <option value="Bunk">Bunk Bed</option>
                    <option value="Queen">Queen</option>
                    <option value="King">King</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    En Suite
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                    <Toilet className="size-5" />
                  </div>
                  <select
                    name="ensuite"
                    className="select select-bordered w-full pl-10"
                    value={formData.ensuite || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, ensuite: e.target.value });
                    }}
                  >
                    <option className="font-raleway" disabled selected></option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">Wifi</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                    <Wifi className="size-5" />
                  </div>

                  <select
                    name="wifi"
                    className="select select-bordered w-full pl-10"
                    value={formData.wifi || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, wifi: e.target.value });
                    }}
                  >
                    <option
                      className="font-raleway"
                      value=""
                      disabled
                      selected
                    ></option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">Pets</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                    <Dog className="size-5" />
                  </div>
                  <select
                    name="pets"
                    className="select select-bordered w-full pl-10"
                    value={formData.pets || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, pets: e.target.value });
                    }}
                  >
                    <option className="font-raleway" disabled selected></option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    Location
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                    <MapPinPlusInside className="size-5" />
                  </div>
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
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
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
                    className="input pl-10 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full"
                    onChange={async (e) => {
                      console.log("FILES:", e.target.files);
                      const filesArray = Array.from(e.target.files);
                      const uploadedUrls = await uploadImagestoCloudinary(
                        filesArray
                      );
                      setFormData((prev) => ({
                        ...prev,
                        images: [...prev.images, ...uploadedUrls],
                      }));
                    }}
                  />
                </div>
              </div>

              <div className="form-control col-span-3 row-span-3">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    Property Description
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50"></div>
                  <textarea
                    className="textarea textarea-bordered w-full h-36"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  ></textarea>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-start"></div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    loading ||
                    !formData.title ||
                    !formData.description ||
                    !formData.price_per_month ||
                    !formData.bedType ||
                    formData.wifi === undefined ||
                    formData.pets === undefined ||
                    formData.ensuite === undefined ||
                    !formData.propertyType ||
                    !formData.location ||
                    formData.images.length === 0
                  }
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <>
                      <PlusCircleIcon className="size-5" />
                      Add Property
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminProductPage;
