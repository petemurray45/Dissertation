import react from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  MdOutlineArrowCircleLeft,
  MdOutlineArrowCircleRight,
} from "react-icons/md";
import carImage from "../../assets/car.png";

function PropertyTile({ property, showCar }) {
  const hasImages = property.imageUrls && property.imageUrls.length > 0;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const navigate = useNavigate();

  const handleSelect = (property) => {
    navigate(`/property/${property.id}`, {
      state: { property }, // passing property object to user property page
    });
  };

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
    <>
      <div className="card bg-base-100 hover:shadow-xl transition-shadow duration-200 overflow-hidden w-full gap-10 max-h-fit">
        <div className="relative w-full h-64">
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
        </div>
        <div className="card-body">
          <div className="w-full rounded-xl">
            <div className="w-[40%] h-7 flex items-center rounded-xl mb-2">
              <span className="bg-[#02343F] text-white p-2">Price</span>
              <span className="bg-[#f0edcc] p-2">
                £{property.price_per_month}pm
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <h2 className="card-title">{property.location}</h2>
              <p>{property.description}</p>
              <button className="btn btn-primary rounded-md bg-[#02343F] text-white mt-4 w-32 hover:bg-[#F0EDCC] hover:text-black">
                View
              </button>
            </div>
            <div className="flex items-center justify-center flex-col">
              <p className="font-bold text-2xl bg-#02343F">7 minutes</p>
              <img src={carImage} className="h-[5rem]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PropertyTile;
