import React, { useEffect, useState } from "react";
import { useListingStore } from "../../utils/useListingsStore";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, SaveIcon, Trash2Icon } from "lucide-react";

function AdminProductPage({ property }) {
  // data from lisitings store
  const {
    currentProperty,
    formData,
    setFormData,
    loading,
    error,
    fetchProperty,
    updateProperty,
    deleteProperty,
  } = useListingStore();

  const hasImages = property.imageUrls && property.imageUrls.length > 0;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // used to navigate to different route
  const navigate = useNavigate();
  // gets property id from url
  const { id } = useParams();

  // image slider function
  const goToNextImage = () => {
    if (hasImages) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % property.imageUrls.length
      );
    }
  };

  const goToPrevImage = () => {
    if (hasImages) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + property.imageUrls.length) %
          property.imageUrls.length
      );
    }
  };

  useEffect(() => {
    fetchProperty(id);
  }, [fetchProperty, id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      await deleteProperty(id);
      navigate("/");
    }
  };
  // handle upload of new images
  const uploadImagestoCloudinary = async (files) => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "property-app");
      formData.append("cloud_name", "dnldppxxg");

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dnldppxxg/image/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return res.data.secure_url;
      } catch (err) {
        console.log("Error with cloudinary image upload", err);
        return null;
      }
    });
    const results = await Promise.all(uploadPromises);
    return results.filter((url) => url !== null);
  };

  // handle form submission
  const handleSubmit = async (e) => {
    console.log("handleSubmit e:", e);
    e.preventDefault();

    try {
      const files = Array.from(fileInputRef.current?.files || []);
      const imageUrls = await uploadImagestoCloudinary(files);

      console.log("FORM DATA STATE:", formData);

      const finalPayload = {
        ...formData,
        images: imageUrls,
      };
      await updateProperty(finalPayload);
      console.log("Sent final payload to backend", finalPayload);

      resetForm();
      toast.success("Property Updated!");
    } catch (err) {
      console.log("Error in image upload", err);
      toast.error("Property update failed.");
    }
  };

  if (loading) {
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

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <button onClick={() => navigate("/")} className="btn btn-ghost mb-8">
        <ArrowLeftIcon className="size-4 mr-2" />
        Back to dashboard
      </button>

      <div className="flex sm:grid-cols-1 max-w-4xl mx-auto mt-20">
        {/*Property Image */}
        {hasImages ? (
          <>
            <img
              src={property.imageUrls[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            {/* previous button */}
            {property.imageUrls.length > 1 && (
              <button
                onClick={goToPrevImage}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100 z-10"
              >
                <MdOutlineArrowCircleLeft className="size-6" />
              </button>
            )}

            {/* next button */}
            {property.imageUrls.length > 1 && (
              <button
                onClick={goToNextImage}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100 z-10"
              >
                <MdOutlineArrowCircleRight className="size-6" />
              </button>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
            No Image Available
          </div>
        )}
      </div>

      <div className="card bg-base-100 shadow-lg max-w-md w-full">
        {/*property info */}
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Edit Property</h2>

          <form onSubmit={handleSubmit}></form>
        </div>
      </div>
    </div>
  );
}

export default AdminProductPage;
