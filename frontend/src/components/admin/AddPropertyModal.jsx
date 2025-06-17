import { useListingStore } from "../../listings/useListingsStore";
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

function AddPropertyModal() {
  const { addProperty, formData, setFormData, loading, resetForm } =
    useListingStore();

  const uploadImagestoCloudinary = async (files) => {
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "property-app");
      formData.append("cloud_name", "dnldppxxg");

      const res = axios.post(
        "https://api.cloudinary.com/v1_1/dnldppxxg/image/upload",
        formData
      );
      const data = res.data;
      uploadedUrls.push(data.secure_url);
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    console.log("handleSubmit e:", e);
    e.preventDefault();

    try {
      console.log("Type of formData.images:", typeof formData.images);
      console.log("Is Array:", Array.isArray(formData.images));
      console.log("Contents:", formData.images);
      const imageUrls = await uploadImagestoCloudinary(formData.images);

      await addProperty({
        ...formData,
        images: undefined,
        imageUrls,
      });
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
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
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
                  setFormData({ ...formData, description: e.target.value });
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
                  setFormData({ ...formData, price: e.target.value });
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
                  setFormData({ ...formData, bedrooms: e.target.value });
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
                  setFormData({ ...formData, location: e.target.value });
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
                min="0"
                step="0.0001"
                placeholder="Latitude"
                className="input input-bordered w-full !pl-10 py-3 focus:input-primary transition-colors duration-200"
                value={formData.latitude}
                onChange={(e) => {
                  setFormData({ ...formData, latitude: e.target.value });
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
                min="0"
                step="0.0001"
                placeholder="Longitude"
                className="input input-bordered w-full !pl-10 py-3 focus:input-primary transition-colors duration-200"
                value={formData.longitude}
                onChange={(e) => {
                  setFormData({ ...formData, longitude: e.target.value });
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
            <button className="btn btn-ghost">Cancel</button>

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
