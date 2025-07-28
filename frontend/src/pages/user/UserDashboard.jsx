import NavBar from "../../components/user/NavBar";
import Hero from "../../components/user/Hero";
import PropertyCarousel from "../../components/user/PropertyCarousel.jsx";
import LocationCarousel from "../../components/user/LocationCarousel.jsx";
import { useListingStore } from "../../utils/useListingsStore";
import { useEffect } from "react";
import { PackageIcon } from "lucide-react";
import DashboardInfo from "../../components/user/DashboardInfo.jsx";
function UserDashboard() {
  const { properties, loading, error, fetchProperties } = useListingStore();

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return (
    <div
      className="relative overflow-hidden min-h-screen w-full "
      style={{
        backgroundImage: `linear-gradient(to right bottom, #f0edcc, #bbc9ac, #89a690, #5c8378, #346060, #396067, #40606b, #49606e, #778491, #a5abb5, #d3d4d9, #ffffff)`,
      }}
    >
      <NavBar />
      <Hero />

      <div className="w-full">
        {error && <div className="alert alert-error mb-8">{error}</div>}
        {properties.length === 0 && !loading && (
          <div className="flex flex-col justify-center items-center h-96">
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
          <div className="mt-64">
            <PropertyCarousel properties={properties} />
            <LocationCarousel />
            <div className="divider my-20 bg-gray-00 h-[10px]" />
            <DashboardInfo />
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
