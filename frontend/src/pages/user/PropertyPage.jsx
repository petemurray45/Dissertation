import { useListingStore } from "../../utils/useListingsStore";
import { useEffect } from "react";
import { PackageIcon } from "lucide-react";
import NavBar from "../../components/user/NavBar";
import PropertyTile from "../../components/user/PropertyTile";
import ProximitySearch from "../../components/user/ProximitySearch";

import axios from "axios";

function PropertyPage() {
  const {
    properties,
    loading,
    error,
    fetchProperties,
    searchSubmitted,
    searchedLocation,
    handleSearch,
  } = useListingStore();

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const sortedProperties = [...properties].sort((a, b) => {
    return (
      (a.travelTime?.value || Infinity) - (b.travelTime?.value || Infinity)
    );
  });

  return (
    <>
      <div className="overflow-x-hidden   bg-radial-fade h-screen">
        <NavBar />
        <div className=" bg-[url('https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] w-full h-[40%]  ">
          <ProximitySearch onSearch={handleSearch} />
        </div>

        {searchSubmitted && searchedLocation && (
          <h1 className="text-4xl font-semibold text-black text-center mt-[8%] mb-0">
            Showing properties near {searchedLocation.location}
            <span className="text-[#02343F]"></span>
          </h1>
        )}

        <div className="w-full">
          {error && <div className="alert alert-error mb-8">{error}</div>}
          {properties.length === 0 && !loading && (
            <div className="flex flex-col justify-center items-center h-96 space-y-4">
              <div className="bg-base-100 rounded-full p-6">
                <PackageIcon className="size-12" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold">No Properties found</h3>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loading loading-spinner loading-lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 my-[30%] md:my-[8%] px-10">
              {sortedProperties.map((property) => (
                <PropertyTile property={property} key={property.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PropertyPage;
