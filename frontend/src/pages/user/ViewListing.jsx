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
        <div className="w-full h-[80%]  rounded-2xl mx-auto mt-5 ">
          <button
            onClick={() => navigate("/properties")}
            className="btn btn-ghost m-8 text-lg"
          >
            <ArrowLeftIcon className="size-4 mr-2" />
            Back to dashboard
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-32">
            <ImageGallery images={currentProperty.images} />
            <PropertyInfo />
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewListing;
