import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  MdOutlineArrowCircleLeft,
  MdOutlineArrowCircleRight,
} from "react-icons/md";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useListingStore } from "../../utils/useListingsStore";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useTravelStore } from "../../utils/useTravelStore";
import { useUserStore } from "../../utils/useUserStore";

function PropertyTile({ property, isLiked, onToggleLike }) {
  const hasImages = property.imageUrls && property.imageUrls.length > 0;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showTimes, setShowTimes] = useState(false);
  const { searchDestinations } = useTravelStore();
  const { travelSearchSubmitted } = useListingStore();
  const { user } = useUserStore();

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const navigate = useNavigate();

  const handleSelect = (property) => {
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

  console.log("Rendered property ID:", property.id);
  console.log("Travel Times for this property:", property.travelTimes);
  console.log("Search Destinations:", searchDestinations);

  return (
    <>
      <div className="h-auto flex flex-col flex-grow relative bg-[#f5f8f6] shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden w-full gap-10s  rounded-2xl">
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
                className="w-full h-full object-cover rounded-bl-none rounded-br-none shadow-md" // Ensure image covers the area
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

          {travelSearchSubmitted && (
            <button
              onClick={() => setShowTimes(!showTimes)}
              className="w-full sm:h-12 md:h-12 bg-[#02343F] text-white sm:text-sm md:text-xl py-1  flex items-center justify-center gap-1 font-raleway"
            >
              {showTimes ? "Hide Travel Times" : "Show Travel Times"}
              {showTimes ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          )}
        </div>

        <AnimatePresence initial={false}>
          {showTimes && (
            <motion.div
              key="travel-times"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute w-full top-[280px] sm:top-[300px] bottom-0 left-0 right-0 overflow-auto  bg-[#02343F] px-4 py-2 space-y-2 text-lg text-white border-t border-gray-300 font-raleway"
            >
              {property.travelTimes && property.travelTimes.length > 0 ? (
                <ul className="space-y-1">
                  {property.travelTimes.map((time, index) => (
                    <li key={index} className="pt-2">
                      <span className="text-2xl pr-5">
                        {time.duration} to{}
                      </span>
                      <span className="italic text-2xl">
                        {searchDestinations[index]?.label || time.destination}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No travel time available</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="card-body flex flex-col items-center text-center sm:items-start sm:text-left  px-4">
          <div className="grid grid-cols-2 w-full md:flex justify-between items-start gap-10 sm:mt-5 mb-2 text-gray-600 text-shadow-none">
            <h2 className="w-full text-left text-md md:text-3xl font-thin  gap-2 mb-2">
              {property.location}
            </h2>
            <div className="sm:h-8 md:h-12 flex justify-center items-center">
              <span className="bg-[#02343F] text-white px-2 py-1 text-sm sm:text-md md:text-xl font-raleway ">
                Price
              </span>
              <span className="bg-[#f0edcc] px-2 py-1 text-sm sm:text-md md:text-xl font-semibold font-raleway">
                £{property.price_per_month}pm
              </span>
            </div>
          </div>
          <div className="w-full flex justify-start">
            <p className="font-raleway text-left sm:text-lg md:text-2xl sm:mb-2 md:mb-4  text-[#02343F] text-shadow-none">
              {property.title}
            </p>
          </div>

          <div className="w-full flex justify-end md:w-full md:flex md:justify-end">
            <button
              type="button"
              className="w-full md:w-auto sm:w-96 btn bg-[#02343F] text-white hover:bg-[#F0EDCC] hover:text-black font-raleway text-md md:text-xl font-thin mt-2 rounded-md"
              onClick={() => handleSelect(property)}
            >
              View
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PropertyTile;
