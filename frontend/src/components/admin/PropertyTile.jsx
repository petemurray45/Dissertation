import React, { useState } from "react";
import AddPropertyModal from "./PropertyModal";
import { MdOutlineArrowCircleLeft } from "react-icons/md";
import { MdOutlineArrowCircleRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function PropertyTile({ property, onEdit }) {
  const hasImages = property.imageUrls && property.imageUrls.length > 0;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

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

  const handleSelect = () => {
    if (typeof onEdit === "function") {
      onEdit(property);
    } else {
      navigate(`/agency/editproperty/${property.id}`);
    }
  };
  return (
    <div
      className="card bg-base-100 glass hover:shadow-xl shadow-l transition-shadow duration-300 overflow-hidden w-full gap-10 border border-gray-400 max-h-[500px] min-h-[500px] min-w-[400px] font-raleway"
      data-testid={`property-card-${property.id}`}
    >
      <figure className="relative w-full h-64">
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
        <h2 className="card-title" data-testid="prop-title">
          {property.title}
        </h2>
        <p>{property.location}</p>
        <div className="card-actions justify-end">
          <p className="font-bold">£{property.price_per_month}</p>
          <button
            className="btn btn-primary"
            type="button"
            data-testid="tile-select"
            aria-label="Edit Property"
            onClick={handleSelect}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyTile;
