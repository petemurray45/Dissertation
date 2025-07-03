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
      <div className="overflow-x-hidden  bg-radial-fade  h-screen w-full">
        <NavBar />
        <div className="flex justify-between sticky top-0 z-50 items-center w-full h-[10%] px-6 bg-[#02343F] ">
          <button
            onClick={() => navigate("/properties")}
            className="btn btn-ghost m-8 text-lg hover:bg-[#F0EDCC] hover:text-black text-white"
          >
            <ArrowLeftIcon className="size-4 mr-2 hover:text-black" />
            Back to search
          </button>
          <h1 className="text-6xl text-white font-medium items-center justify-center px-1 ">
            {currentProperty.location}
          </h1>
          <p className="text-5xl text-white">
            £{currentProperty.price_per_month}pm
          </p>
        </div>
        <div className="w-full h-[80%]  rounded-2xl mx-auto ">
          <ImageGallery images={currentProperty.images} />
          <div className="flex h-full ml-10">
            <PropertyInfo property={currentProperty} key={currentProperty.id} />
            <MapSearch property={currentProperty} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewListing;
