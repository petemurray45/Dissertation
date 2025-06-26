import NavBar from "../../components/user/NavBar";
import Hero from "../../components/user/Hero";
import Search from "../../components/user/Search";
import PropertyCarousel from "../../components/user/PropertyCarousel.jsx";
import React from "react";
import { useListingStore } from "../../utils/useListingsStore";
import { useEffect } from "react";
import { PackageIcon } from "lucide-react";

function UserDashboard() {
  const { properties, loading, error, fetchProperties } = useListingStore();

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);
  return (
    <div className="overflow-x-hidden px-16 bg-[#F0EDCC]">
      <NavBar />
      <Hero />
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
          <div className="w-full">
            <PropertyCarousel properties={properties}/>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
