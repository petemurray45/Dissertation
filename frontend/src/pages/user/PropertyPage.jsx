import { useListingStore } from "../../utils/useListingsStore";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { PackageIcon } from "lucide-react";
import NavBar from "../../components/user/design-components/NavBar";
import PropertyTile from "../../components/user/design-components/PropertyTile";
import SearchDrawer from "../../components/user/searches/SearchDrawer";
import { useUserStore } from "../../utils/useUserStore";
import { useTravelStore } from "../../utils/useTravelStore";
import MainSearch from "../../components/user/searches/MainSearch";
import Pagination from "../../components/user/design-components/Pagination";

function PropertyPage() {
  const {
    properties,
    filteredProperties,
    loading,
    error,
    fetchPropertiesRadius,
    searchSubmitted,
    setSearchSubmitted,
    fetchPaginatedProperties,
    pagination,
  } = useListingStore();

  const { addToLikes, likedPropertyIds, user } = useUserStore();
  const { resetSearchDestinations } = useTravelStore();
  const resultsRef = useRef();
  const query = new URLSearchParams(useLocation().search);
  const [openTileId, setOpenTileId] = useState(null);
  const location = query.get("location");
  const radius = query.get("radius");

  useEffect(() => {
    const params = Object.fromEntries(
      new URLSearchParams(window.location.search)
    );
    const { lat, lng, radius, minPrice, maxPrice } = params;

    if (lat && lng && radius) {
      setSearchSubmitted(true);
      fetchPropertiesRadius({
        lat,
        lng,
        radius,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
      });
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchPaginatedProperties();
      resetSearchDestinations();
    };
    init();
  }, []);

  const propertyList =
    searchSubmitted &&
    Array.isArray(filteredProperties) &&
    filteredProperties.length > 0
      ? filteredProperties
      : properties;

  console.log("PROPERTY LIST:", propertyList);

  useEffect(() => {
    const scrollToResults = () => {
      const resultsSection = document.getElementById("results");
      resultsSection?.scrollIntoView({ behavior: "smooth" });
    };

    if (!loading && pagination.currentPage) {
      scrollToResults();
    }

    if (searchSubmitted && propertyList.length > 0) {
      scrollToResults();
    }
  }, [pagination.currentPage, loading, searchSubmitted, propertyList]);

  const toggleLike = async (property) => {
    if (!user) return;
    try {
      await addToLikes(property);
      console.log("property liked:", property.id);
    } catch (err) {
      console.log("Failed to like property", property.id);
    }
  };

  console.log(
    "search submitted:",
    searchSubmitted,
    "filtered properties:",
    filteredProperties
  );

  console.log("propertyList:", propertyList);

  return (
    <>
      <div
        className="relative overflow-hidden min-h-screen"
        style={{
          backgroundImage: `linear-gradient(to right top, #ffffff, #d3d4d9, #a5abb5, #778491, #49606e, #435f6c, #3e5e69, #395d66, #5d7d85, #829fa6, #a9c3c8, #d1e7eb)`,
        }}
      >
        <div>
          <NavBar />
          <header className="pt-24 md:pt-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-10">
              <div className=" mx-auto text-center">
                <h1 className="font-raleway font-bold text-white text-2xl sm:text-3xl md:text-5xl leading-tight">
                  Designed to find a room that suits ALL of your life.
                </h1>
                <h2 className="text-white text-base sm:text-lg md:text-2xl pt-4 md:pt-6">
                  Use our tailored search function below to begin!
                </h2>
              </div>
            </div>
          </header>
        </div>

        <div className="lg:mt-10 sm:mt-7">
          <MainSearch />
        </div>

        <div>
          {location && radius && (
            <div className="text-center text-4xl py-4 text-gray-100 font-raleway">
              Showing properties within {radius} km of {location}
            </div>
          )}
        </div>

        <div className="sm:mb-10">
          <SearchDrawer />
        </div>

        <div className="w-full">
          {error && <div className="alert alert-error mb-8">{error}</div>}
          {propertyList.length === 0 && !loading && (
            <div className="flex flex-col justify-center items-center h-96 space-y-4">
              <div className="bg-base-100 rounded-full p-6">
                <PackageIcon className="size-12" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="sm:text-xl md:text-2xl font-semibold">
                  No Properties found
                </h3>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loading loading-spinner loading-lg" />
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10  md:my-[4%] px-5 sm:px-6 md:px-10 scroll-mt-24 "
              id="results"
              data-testid="listing-grid"
              ref={resultsRef}
            >
              {Array.isArray(propertyList) &&
                propertyList.map((property) => {
                  console.log("Current open tile ID:", openTileId);
                  console.log(
                    "Property list with IDs:",
                    propertyList.map((p) => p.id)
                  );
                  return (
                    <PropertyTile
                      property={property}
                      key={property.id}
                      isOpen={openTileId === property.id}
                      onToggleOpen={() =>
                        setOpenTileId((prev) =>
                          prev === property.id ? null : property.id
                        )
                      }
                      onToggleLike={() => toggleLike(property)}
                      isLiked={likedPropertyIds.includes(property.id)}
                    />
                  );
                })}
            </div>
          )}
          <Pagination />
        </div>
      </div>
    </>
  );
}

export default PropertyPage;
