import react from "react";
import NavBar from "../../components/user/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { useListingStore } from "../../utils/useListingsStore";
import ImageGallery from "../../components/user/ImageGallery";
import PropertyInfo from "../../components/user/PropertyInfo";
import MapSearch from "../../components/user/MapSearch";
import { useEffect } from "react";

function ViewListing() {
  const { fetchProperty, loading, currentProperty, error } = useListingStore();
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    if (!currentProperty || currentProperty.id !== Number(id)) {
      fetchProperty(id);
    }
  }, [id]);

  if (loading || !currentProperty) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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
  console.log(currentProperty);
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
        <div className="flex flex-row gap-10 w-full h-[80%]  rounded-2xl mx-auto px-20 py-5">
          <div className="w-full md:w-2/3">
            <ImageGallery images={currentProperty.images} />
          </div>

          <div className="w-full md:w-1/3">
            <PropertyInfo property={currentProperty} key={currentProperty.id} />
          </div>
        </div>

        <MapSearch property={currentProperty} />

        <div className="flex h-full mt-5">
          {/*<MapSearch property={currentProperty} />*/}
        </div>
      </div>
    </>
  );
}

export default ViewListing;
