import { useListingStore } from "../../utils/useListingsStore";
import { useEffect } from "react";
import { PackageIcon } from "lucide-react";
import NavBar from "../../components/user/NavBar";
import PropertyTile from "../../components/user/PropertyTile";
import SearchDrawer from "../../components/user/SearchDrawer";
import { useUserStore } from "../../utils/useUserStore";
import MainSearch from "../../components/user/MainSearch";

function PropertyPage() {
  const {
    properties,
    loading,
    error,
    fetchProperties,
    searchSubmitted,
    searchedLocation,
  } = useListingStore();

  const { addToLikes, likedPropertyIds, user } = useUserStore();

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const toggleLike = async (property) => {
    if (!user) return;
    try {
      await addToLikes(property);
      console.log("property liked:", property.id);
    } catch (err) {
      console.log("Failed to like property", property.id);
    }
  };

  console.log(properties);

  const sortedProperties = properties
    .map((property) => {
      const travelTimeStr = property.travelTime ?? "";
      const travelTimeParsed = parseInt(
        travelTimeStr.replace(/[^\d]/g, ""),
        10
      );
      return {
        ...property,
        travelTimeMinutes: isNaN(travelTimeParsed)
          ? Infinity
          : travelTimeParsed,
      };
    })
    .sort((a, b) => a.travelTimeMinutes - b.travelTimeMinutes);

  return (
    <>
      <div className="relative overflow-hidden  ">
        <div className=" bg-[url('https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-no-repeat bg-cover bg-top w-full h-[40%] top-0 left-0 z-20  ">
          <NavBar />
          <div className="w-full pt-48">
            <div className="flex flex-col justify-center">
              <h1 className="text-6xl text-center text-white font-raleway font-bold text-shadow-xl">
                Designed to find a room that suits ALL of your life.
              </h1>
              <h2 className="text-4xl text-center text-white text-shadow-xl pt-5">
                Open our tailored search function below to begin!
              </h2>
              <h3 className="text-3xl text-center text-white text-shadow-lg pt-10"></h3>
            </div>
          </div>
        </div>

        <MainSearch />

        <div>
          <SearchDrawer />
        </div>

        {searchSubmitted && searchedLocation && (
          <h1 className="text-4xl  text-black text-center mt-[4%]  sm:mt-[6%] font-raleway font-thin">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10  md:my-[4%] px-10">
              {sortedProperties.map((property) => (
                <PropertyTile
                  property={property}
                  key={property.id}
                  onToggleLike={() => toggleLike(property)}
                  isLiked={likedPropertyIds.includes(property.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PropertyPage;
