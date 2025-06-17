import React, { useState } from "react";
import AddPropertyModal from "./AddPropertyModal";
import { MdOutlineArrowCircleLeft } from "react-icons/md";
import { MdOutlineArrowCircleRight } from "react-icons/md";

function PropertyCard({ property }) {
  const hasImages = property.imageUrls && property.imageUrls.length > 0;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
  return (
    <div>
      <div className="card w-96 glass shadow-lg">
        <figure className="relative w-full h-64 overflow-hidden">
          {hasImages ? (
            <>
              <img
                src={property.imageUrls[currentImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover" // Ensure image covers the area
              />

              {/* Previous Button */}
              {property.imageUrls.length > 1 && (
                <button
                  onClick={goToPrevImage}
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100 z-10"
                >
                  <MdOutlineArrowCircleLeft className="size-6" />
                </button>
              )}

              {/* Next Button */}
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
        </figure>
        <div className="card-body">
          <h2 className="card-title">{property.title}</h2>
          <p>{property.description}</p>
          <div className="card-actions justify-end">
            <p className="font-bold">£{property.price_per_month}</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                document.getElementById("add_property_modal").showModal();
              }}
            >
              Select
            </button>
          </div>
        </div>
        <AddPropertyModal />
      </div>
    </div>
  );
}

export default PropertyCard;
