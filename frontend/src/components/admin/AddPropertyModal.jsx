import { useListingStore } from "../../utils/useListingsStore.js";
import {
  House,
  Text,
  PoundSterling,
  BedDouble,
  MapPinPlusInside,
  Compass,
  PlusCircleIcon,
  ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRef } from "react";

function AddPropertyModal() {
  const { addProperty, formData, setFormData, loading, resetForm } =
    useListingStore();

  const fileInputRef = useRef();

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

  const handleSubmit = async (e) => {
    console.log("handleSubmit e:", e);
    e.preventDefault();

    try {
      const files = Array.from(fileInputRef.current?.files || []);
      const imageUrls = await uploadImagestoCloudinary(files);

      console.log("FORM DATA STATE:", formData);

      const finalPayload = {
        ...formData,
        images: imageUrls,
      };
      await addProperty(finalPayload);
      console.log("Sent final payload to backend", finalPayload);

      resetForm();
      toast.success("Property Added!");
    } catch (err) {
      console.log("Error in image upload", err);
      toast.error("Property creation failed.");
    }
  };

  return (
    <dialog id="add_property_modal" className="modal">
      <div className="modal-box">
        {/* Close Button */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            X
          </button>
        </form>
        {/* Modal Header */}
        <h3 className="font-bold text-xl mb-8">Add New Property</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/*Property Name Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium">
                Property name
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <House className="size-5" />
              </div>

              <input
                type="text"
                placeholder="Enter Property Name"
                className="input input-bordered w-full !pl-10 py-3 focus:input-primary transition-colors duration-200"
                value={formData.title}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, title: e.target.value }));
                }}
              />
            </div>
          </div>

          {/* Property Description Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium">
                Add a description
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <Text className="size-5" />
              </div>

              <textarea
                placeholder="Enter property description"
                className="input input-bordered w-full !pl-10 py-3 focus:input-primary transition-colors duration-200"
                value={formData.description}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                }}
              />
            </div>
          </div>

          <div></div>

          {/* Price Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium">
                Price per month
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <PoundSterling className="size-5" />
              </div>

              <input
                type="number"
                min="0"
                step="50.00"
                placeholder="0.00"
                className="input input-bordered w-full !pl-10 py-3 focus:input-primary transition-colors duration-200"
                value={formData.price}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, price: e.target.value }));
                }}
              />
            </div>
          </div>

          {/* Bedrooms Modal*/}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium">Bedrooms</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <BedDouble className="size-5" />
              </div>

              <input
                type="number"
                min="0"
                step="1"
                placeholder="0"
                className="input input-bordered w-full !pl-10 py-3 focus:input-primary transition-colors duration-200"
                value={formData.bedrooms}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    bedrooms: e.target.value,
                  }));
                }}
              />
            </div>
          </div>

          {/* Location */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium">Location</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <MapPinPlusInside className="size-5" />
              </div>

              <input
                type="Text"
                min="0"
                step="1"
                placeholder="0"
                className="input input-bordered w-full !pl-10 py-3 focus:input-primary transition-colors duration-200"
                value={formData.location}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }));
                }}
              />
            </div>
          </div>

          {/* Latitude modal */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium">Latitude</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <Compass className="size-5" />
              </div>

              <input
                type="number"
                name="latitude"
                min="0"
                step="0.0001"
                placeholder="Latitude"
                className="input input-bordered w-full !pl-10 py-3 focus:input-primary transition-colors duration-200"
                value={formData.latitude}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    latitude: e.target.value,
                  }));
                }}
              />
            </div>
          </div>

          {/*Longitude modal*/}

          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium">
                Longitude
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <Compass className="size-5" />
              </div>

              <input
                type="number"
                name="longitude"
                min="0"
                step="0.0001"
                placeholder="Longitude"
                className="input input-bordered w-full !pl-10 py-3 focus:input-primary transition-colors duration-200"
                value={formData.longitude}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    longitude: e.target.value,
                  }));
                }}
              />
            </div>
          </div>

          {/* Image Upload */}

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
                ref={fileInputRef} // used as parameter for query selector in handleSubmit
                type="file"
                accept="image/*"
                multiple
                className="input input-bordered w-full !pl-10 py-3 focus:input-primary transition-colors duration-200"
                onChange={(e) => {
                  console.log("FILES:", e.target.files);
                  const filesArray = Array.from(e.target.files);
                  setFormData((prev) => ({ ...prev, images: filesArray }));
                }}
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={() => {
                document.getElementById("add_property_modal").close();
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary min-w[120px]"
              /* disabled={
                !formData.title ||
                !formData.description ||
                !formData.price ||
                !formData.bedrooms ||
                !formData.location ||
                !formData.latitude ||
                !formData.longitude
              } */
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
    </dialog>
  );
}

export default AddPropertyModal;
