import { useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useListingStore } from "../../utils/useListingsStore";
import UserAutocomplete from "./UserAutocomplete";
import {
  ArrowLeftIcon,
  SaveIcon,
  Trash2Icon,
  House,
  Text,
  PoundSterling,
  BedDouble,
  MapPinPlusInside,
  Compass,
  PlusCircleIcon,
  ImageIcon,
  Dog,
  Wifi,
  Toilet,
} from "lucide-react";

function SearchDrawer() {
  const [open, setOpen] = useState(false);
  const {
    location,
    setLocation,
    maxTravelTime,
    setMaxTravelTime,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    setSearchSubmitted,
    setSearchedLocation,
  } = useListingStore();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Location at search time", location);

    onSearch({
      location,
      maxTravelTime,
      minPrice,
      maxPrice,
    });

    setSearchSubmitted(true);
    setSearchedLocation(location);
  };

  return (
    <div className=" w-full px-10 mx-auto mt-5 font-raleway">
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-[#02343F] text-white px-4 py-3 rounded-t-lg text-center text-2xl flex justify-center items-center font-semibold"
      >
        {open ? (
          <span className="flex items-center gap-2 font-raleway font-thin">
            SEARCH <FaArrowUp className="size-6" />
          </span>
        ) : (
          <span className="flex items-center gap-2 font-raleway font-thin">
            SEARCH <FaArrowDown className="size-6" />
          </span>
        )}
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-96 py-4" : "max-h-0"
        } bg-gray-100 px-4 rounded-b-lg`}
      >
        <div className="w-full">
          <form
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-7 items-start"
            onSubmit={handleSearch}
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">
                  Essential Location
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <House className="size-5" />
                </div>
                <UserAutocomplete
                  onPlaceSelect={(value) => setLocation(value)}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">
                  Min Price
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <PoundSterling className="size-5" />
                </div>
                <input
                  type="text"
                  placeholder="0"
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
                  placeholder="Pick a bed type"
                  value={formData.propertyType || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, propertyType: e.target.value })
                  }
                >
                  <option className="font-raleway" disabled selected></option>
                  <option value="Bungalow">Bungalow</option>
                  <option value="Semi Detached">Semi Detached</option>
                  <option value="Detached">Detached</option>
                  <option value="Terrace">Terrace</option>
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
                <UserAutocomplete
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

            {/* Form Actions */}
            <div className="flex justify-start"></div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SearchDrawer;
