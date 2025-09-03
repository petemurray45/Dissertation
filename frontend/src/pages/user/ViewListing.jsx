import NavBar from "../../components/user/design-components/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { useListingStore } from "../../utils/useListingsStore";
import ImageGallery from "../../components/user/design-components/ImageGallery";
import PropertyInfo from "../../components/user/design-components/PropertyInfo";
import MapSearch from "../../components/user/user-actions/MapSearch";
import Description from "../../components/user/design-components/Description";
import SecondaryNav from "../../components/user/navs/secondaryNav";
import PlacesSection from "../../components/user/design-components/PlacesSection";
import EnquireForm from "../../components/user/user-actions/EnquireForm";
import MakeNote from "../../components/user/user-actions/MakeNote";
import { useEffect, useState } from "react";
import { useUserStore } from "../../utils/useUserStore";

function ViewListing() {
  const { fetchProperty, loading, currentProperty, error } = useListingStore();
  const { addToLikes, likedPropertyIds, user } = useUserStore();
  const [activeTab, setActiveTab] = useState("routePlanner");

  const navigate = useNavigate();
  const { id } = useParams();

  const tabSelectors = [
    { key: "routePlanner", label: "Plan your routes" },
    { key: "nearbyPlaces", label: "Places nearby" },
    { key: "notes", label: "Make a note" },
    { key: "enquire", label: "Enquire about this room" },
  ];

  useEffect(() => {
    if (!currentProperty || currentProperty.id !== Number(id)) {
      fetchProperty(id);
    }
  }, [id, currentProperty]);

  if (loading || !currentProperty) {
    return (
      <div className="flex justify-center items-center overflow-hidden">
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

  const tabComponents = {
    routePlanner: <MapSearch property={currentProperty} />,
    nearbyPlaces: (
      <PlacesSection
        lat={currentProperty.latitude}
        lng={currentProperty.longitude}
      />
    ),
    enquire: <EnquireForm property={currentProperty} />,
    notes: <MakeNote property={currentProperty} />,
  };

  const toggleLike = async (property) => {
    if (!user) return;
    try {
      await addToLikes(property);
      console.log("property liked:", property.id);
    } catch (err) {
      console.log("Failed to like property", property.id);
    }
  };

  return (
    <>
      <div
        className="overflow-x-hidden min-h-screen w-full"
        style={{
          backgroundImage: `linear-gradient(to right top, #ffffff, #d3d4d9, #a5abb5, #778491, #49606e, #435f6c, #3e5e69, #395d66, #5d7d85, #829fa6, #a9c3c8, #d1e7eb)`,
        }}
        data-testid="view-listing"
      >
        <NavBar />
        <div className="flex justify-between mt-8 md:mt-20   items-center w-full h-[10%] px-6  ">
          <button
            onClick={() => navigate("/properties")}
            className="btn btn-ghost mt-10 md:m-8 text-sm md:text-lg hover:bg-[#02343F] hover:text-white text-white font-raleway font-thin"
          >
            <ArrowLeftIcon className="size-4 mr-2 text-white hover:text-gray-200" />
            Back to search
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full rounded-2xl mx-auto px-4 sm:px-8 lg:px-20 py-2">
          <div className="w-full md:w-2/3">
            <ImageGallery
              images={currentProperty.images}
              agencyLogoUrl={currentProperty.agency_logo_url}
              agencyName={currentProperty.agency_name}
            />
          </div>

          <div className="w-full md:w-1/3 mt-6 md:mt-0">
            <PropertyInfo
              property={currentProperty}
              key={currentProperty.id}
              onToggleLike={() => toggleLike(currentProperty)}
              isLiked={likedPropertyIds.includes(currentProperty.id)}
              agencyLogoUrl={currentProperty.agency_logo_url}
              agencyName={currentProperty.agency_name}
            />
          </div>
        </div>

        <div className="w-full items-center px-4 sm:px-8 lg:px-20 mt-6 md:mt-10">
          <Description property={currentProperty} />
        </div>

        <div className="mt-24">
          <SecondaryNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabSelectors}
          />
        </div>

        <div className="mx-5 md:mx-20">
          {tabComponents[activeTab] ?? <p></p>}
        </div>

        <div className="flex h-full mt-5">
          {/*<MapSearch property={currentProperty} />*/}
        </div>
      </div>
    </>
  );
}

export default ViewListing;
