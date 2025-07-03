import react from "react";
import NavBar from "../../components/user/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { useListingStore } from "../../utils/useListingsStore";
import ImageGallery from "../../components/user/ImageGallery";
import PropertyInfo from "../../components/user/PropertyInfo";
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
      <div className="overflow-x-hidden px-5 py-4 bg-[#F0EDCC]  h-screen w-full">
        <NavBar />
        <div className="flex items-center w-full h-[12%] px-6">
          <h1 className="text-6xl text-black font-medium items-center justify-center px-1">
            {currentProperty.location}
          </h1>
        </div>
        <div className="w-full h-[80%]  rounded-2xl mx-auto ">
          <button
            onClick={() => navigate("/properties")}
            className="btn btn-ghost m-8 text-lg hover:bg-[#02343F] hover:text-white"
          >
            <ArrowLeftIcon className="size-4 mr-2" />
            Back to dashboard
          </button>

          <ImageGallery images={currentProperty.images} />
          <PropertyInfo />
        </div>
      </div>
    </>
  );
}

export default ViewListing;
