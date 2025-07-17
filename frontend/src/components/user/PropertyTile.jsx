import react, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  MdOutlineArrowCircleLeft,
  MdOutlineArrowCircleRight,
} from "react-icons/md";
import { FaCarAlt } from "react-icons/fa";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

import { useTravelStore } from "../../utils/useTravelStore";
import { useUserStore } from "../../utils/useUserStore";

function PropertyTile({ property, isLiked, onToggleLike }) {
  const hasImages = property.imageUrls && property.imageUrls.length > 0;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const { getTravelTimeForProperty, setSelectedTravelTime } = useTravelStore();
  const { user } = useUserStore();

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const navigate = useNavigate();

  const handleSelect = (property) => {
    const travelTime = getTravelTimeForProperty(property.id);
    setSelectedTravelTime(travelTime);
    navigate(`/properties/${property.id}`, {
      state: { property }, // passing property object to user property page
    });
  };

  const handleLikeClick = () => {
    setLiked(!liked);
    onToggleLike(property);
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

  const getTransformedUrl = (url, width = 600, height = 400) => {
    return url.replace(
      "/upload/",
      `/upload/w_${width},h_${height},c_fill,f_auto,q_60/`
    );
  };

  return (
    <>
      <div className="h-[400px] flex flex-col justify-between bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden w-full gap-10s max-h-[500px] min-h-[500px] min-w-[300px] border-2 border-gray-200 rounded-lg">
        <div className="relative w-full max-h-[250px]">
          {hasImages ? (
            <>
              <img
                src={getTransformedUrl(
                  property.imageUrls[currentImageIndex],
                  350,
                  200
                )}
                alt={property.title}
                className="w-full h-full object-cover rounded-bl-none rounded-br-none shadow-xl" // Ensure image covers the area
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

              {user && (
                <button
                  onClick={handleLikeClick}
                  className="absolute top-2 right-2 text-xl"
                >
                  {liked ? (
                    <AiFillHeart className="text-red-500 drop-shadow-sm text-4xl" />
                  ) : (
                    <AiOutlineHeart className=" hover:text-red-500 text-4xl" />
                  )}
                </button>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-raleway">
              No Image Available
            </div>
          )}
        </div>
        <div className="card-body">
          <div className="rounded-xl flex-1 flex flex-col justify-between mt-1">
            <div className="w-[40%] h-7 flex items-center rounded-xl mb-2">
              <span className="bg-[#02343F] text-white p-2 font-raleway">
                Price
              </span>
              <span className="bg-[#f0edcc] p-2 font-raleway font-semibold">
                £{property.price_per_month}pm
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <h2 className="card-title font-raleway">{property.location}</h2>
              <p className="font-raleway">{property.description}</p>

              <button
                type="button"
                className="btn btn-primary rounded-md bg-[#02343F] text-white mt-4 w-32 hover:bg-[#F0EDCC] hover:text-black font-raleway   "
                onClick={(e) => handleSelect(property)}
              >
                View
              </button>
            </div>
            {property.travelTime !== undefined && (
              <div className="flex items-center justify-center flex-row-reverse gap-2 align-middle">
                <p className="font-bold text-md text-center mb-2 bg-#02343F font-raleway">
                  {property.travelTime}
                </p>
                <FaCarAlt className="size-10" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default PropertyTile;
