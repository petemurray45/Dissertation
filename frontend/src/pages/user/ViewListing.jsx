import react from "react";
import NavBar from "../../components/user/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { useListingStore } from "../../utils/useListingsStore";
import ImageGallery from "../../components/user/ImageGallery";
import PropertyInfo from "../../components/user/PropertyInfo";
import MapSearch from "../../components/user/MapSearch";
import Description from "../../components/user/Description";
import SecondaryNav from "../../components/user/navs/secondaryNav";
import PlacesSection from "../../components/user/PlacesSection";
import EnquireForm from "../../components/user/EnquireForm";
import MakeNote from "../../components/user/MakeNote";
import { useEffect, useState } from "react";
import { useUserStore } from "../../utils/useUserStore";

function ViewListing() {
  const { fetchProperty, loading, currentProperty, error } = useListingStore();
  const { addToLikes, likedPropertyIds, user } = useUserStore();
  const [activeTab, setActiveTab] = useState("traveltimes");

  const navigate = useNavigate();
  const { id } = useParams();

  const tabSelectors = [
    { key: "traveltimes", label: "Travel Times" },
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
      <div className="overflow-x-hidden    h-screen w-full">
        <NavBar />
        <div className="flex justify-between mt-20   items-center w-full h-[10%] px-6  ">
          <button
            onClick={() => navigate("/properties")}
            className="btn btn-ghost m-8 text-lg hover:bg-[#02343F] hover:text-white text-black font-raleway font-thin"
          >
            <ArrowLeftIcon className="size-4 mr-2 hover:text-black" />
            Back to search
          </button>
        </div>
        <div className="flex flex-row gap-10 w-full rounded-2xl mx-auto px-20 py-2 max-h-[750px]">
          <div className="w-full md:w-2/3">
            <ImageGallery images={currentProperty.images} />
          </div>

          <div className="w-full md:w-1/3">
            <PropertyInfo
              property={currentProperty}
              key={currentProperty.id}
              onToggleLike={() => toggleLike(currentProperty)}
              isLiked={likedPropertyIds.includes(currentProperty.id)}
            />
          </div>
        </div>

        <div className="w-full items-center px-20 pt-10 ">
          <Description property={currentProperty} />
        </div>

        <div className="mt-24">
          <SecondaryNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabSelectors}
          />
        </div>

        <div className="mx-20">
          {tabComponents[activeTab] ?? <p>No tab found</p>}
        </div>

        <div className="flex h-full mt-5">
          {/*<MapSearch property={currentProperty} />*/}
        </div>
      </div>
    </>
  );
}

export default ViewListing;
