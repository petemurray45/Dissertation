import { useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useListingStore } from "../../../utils/useListingsStore";

import {
  House,
  PoundSterling,
  BedDouble,
  Dog,
  Wifi,
  Toilet,
} from "lucide-react";

function SearchDrawer() {
  const [open, setOpen] = useState(false);
  const {
    pendingFilters,
    setPendingFilters,
    applyFilters,
    setSearchSubmitted,
    syncFilters,
    setLoading,
    loading,
    clearFilters,
  } = useListingStore();

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      useListingStore.setState({ loading: true });
      await syncFilters();
      await applyFilters();
      setSearchSubmitted(true);
    } catch (err) {
      console.log("Error syncing filters", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await clearFilters();
      setSearchSubmitted(false);
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      console.log("Failed to clear filters", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" w-full px-5 sm:px-10 mx-auto mt-5 font-raleway mb-10">
      <button
        onClick={() => setOpen(!open)}
        data-testid="open-drawer"
        className="w-full bg-[#02343F] text-white px-4 py-3 rounded-t-lg text-center text-2xl flex justify-center items-center font-semibold"
      >
        {open ? (
          <span className="flex items-center gap-2 font-raleway font-thin">
            Refine Search <FaArrowUp className="size-6" />
          </span>
        ) : (
          <span className="flex items-center gap-2 font-raleway font-thin">
            Refine Search <FaArrowDown className="size-6" />
          </span>
        )}
      </button>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          open ? "max-h-auto py-4" : "max-h-0"
        } bg-gray-100 px-4 rounded-b-lg`}
      >
        <div className="w-full flex flex-col">
          <form
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-7 items-start"
            onSubmit={handleSearch}
            id="advancedSearch"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">
                  Sort By (Price)
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <House className="size-5" />
                </div>
                <select
                  name="sortBy"
                  data-testid="sort-select"
                  className="select select-bordered w-full pl-10"
                  placeholder="Low to high"
                  value={pendingFilters.sortBy}
                  onChange={(e) =>
                    setPendingFilters({ sortBy: e.target.value })
                  }
                >
                  <option value="" className="font-raleway" disabled></option>
                  <option value="price_low_high">Low to high</option>
                  <option value="price_high_low">High to low</option>
                </select>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">
                  Max Price
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <PoundSterling className="size-5" />
                </div>
                <input
                  type="number"
                  placeholder="Max Price"
                  className="input pl-10 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full"
                  value={pendingFilters.maxPrice}
                  onChange={(e) =>
                    setPendingFilters({ maxPrice: e.target.value })
                  }
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
                  type="number"
                  placeholder="Min Price"
                  className="input pl-10 py-1 focus:input-primary transition-colors duration-200 input-bordered w-full"
                  value={pendingFilters.minPrice}
                  onChange={(e) =>
                    setPendingFilters({ minPrice: e.target.value })
                  }
                />
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
                  name="bed_type"
                  className="select select-bordered w-full pl-10"
                  placeholder="Pick a bed type"
                  value={pendingFilters.bed_type}
                  onChange={(e) =>
                    setPendingFilters({ bed_type: e.target.value })
                  }
                >
                  <option value="" className="font-raleway" disabled></option>
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
                  Property Type
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <PoundSterling className="size-5" />
                </div>

                <select
                  name="property_type"
                  data-testid="filter-prop-type"
                  className="select select-bordered w-full pl-10"
                  placeholder="Pick a bed type"
                  value={pendingFilters.property_type}
                  onChange={(e) =>
                    setPendingFilters({ property_type: e.target.value })
                  }
                >
                  <option className="font-raleway" disabled selected></option>
                  <option value="Bungalow">Bungalow</option>
                  <option value="Semi Detached">Semi Detached</option>
                  <option value="Detached">Detached</option>
                  <option value="Terraced">Terrace</option>
                  <option value="Flat">Flat</option>
                  <option value="Cottage">Cottage</option>
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
                  data-testid="filter-ensuite"
                  className="select select-bordered w-full pl-10"
                  value={pendingFilters.ensuite}
                  onChange={(e) => {
                    setPendingFilters({ ensuite: e.target.value });
                  }}
                >
                  <option className="font-raleway" disabled selected></option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
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
                  value={pendingFilters.wifi}
                  onChange={(e) => {
                    setPendingFilters({ wifi: e.target.value });
                  }}
                >
                  <option className="font-raleway" value="" disabled></option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
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
                  value={pendingFilters.pets}
                  onChange={(e) => {
                    setPendingFilters({ pets: e.target.value });
                  }}
                >
                  <option className="font-raleway" disabled></option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            {/* Form Actions */}
          </form>
          <div className="flex justify-center gap-10">
            <button
              type="submit"
              form="advancedSearch"
              className=" h-16 w-80 rounded-md mt-8 mb-4 text-2xl bg-[#02343F] text-white  hover:bg-[#F0EDCC] hover:text-black"
            >
              {loading ? (
                <span className="loading loading-spinner loading-md" />
              ) : (
                "Apply"
              )}
            </button>

            <button
              onClick={handleClear}
              className=" h-16 w-80 rounded-md mt-8 mb-4 text-2xl bg-[#02343F] text-white  hover:bg-[#F0EDCC] hover:text-black"
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchDrawer;
