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
import { Toaster, toast } from "react-hot-toast";
function PropertyTile({ property, isLiked, onToggleLike }) {
  const hasImages = property.imageUrls && property.imageUrls.length > 0;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showLikeMessage, setShowLikeMessage] = useState(false);
  const [likeMessageText, setLikeMessageText] = useState("");
  const [mode, setMode] = useState("driving");
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
    const newLikedState = !liked;
    setLiked(!liked);

    if (newLikedState) {
      setLikeMessageText("Property liked");
    } else {
      setLikeMessageText("Property unliked");
    }

    setShowLikeMessage(true);
    onToggleLike(property);
    setTimeout(() => setShowLikeMessage(false), 2000);
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

  const safeTransform = (url, w = 80, h = 80) => {
    if (!url || typeof url !== "string") return null;
    if (url.includes("/upload/")) {
      return url.replace(
        "/upload/",
        `/upload/w_${w},h_${h},c_fit,f_auto,q_70/`
      );
    }
    return url;
  };

  console.log("Rendered property ID:", property.id);
  console.log("Travel Times for this property:", property.travelTimes);
  console.log("Search Destinations:", searchDestinations);

  return (
    <>
      <div className="w-full rounded-2xl bg-white shadow-md ring-1 ring-black/5 overflow-hidden">
        <div className="relative w-full max-h-[250px]">
          {showLikeMessage && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-gray-700 text-gray-100 px-5 py-1 rounded-md text-xl shadow-md font-raleway">
              {likeMessageText}
            </div>
          )}
          {hasImages ? (
            <>
              <img
                src={safeTransform(
                  property.imageUrls[currentImageIndex],
                  350,
                  200
                )}
                alt={property.title}
                className="w-full h-56 sm:h-64 object-cover aspect-[16/10]"
              />

              <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/35 to-transparent" />

              <div className="absolute bottom-3 left-3 bg-white/85 backdrop-blur rounded-md p-1 shadow-sm">
                <img
                  src={safeTransform(property.agency_logo_url, 350, 200)}
                  alt="agency logo"
                  className="h-20 w-20 object-contain"
                />
              </div>

              {/* Previous Button */}
              {property.imageUrls.length > 1 && (
                <button
                  onClick={goToPrevImage}
                  className="absolute top-1/2 -translate-y-1/2 left-2 rounded-full bg-black/55 text-white p-1"
                >
                  <MdOutlineArrowCircleLeft className="text-2xl" />
                </button>
              )}

              {/* Next Button */}
              {property.imageUrls.length > 1 && (
                <button
                  onClick={goToNextImage}
                  className="absolute top-1/2 -translate-y-1/2 right-2 rounded-full bg-black/55 text-white p-1"
                >
                  <MdOutlineArrowCircleRight className="text-2xl" />
                </button>
              )}

              {user && (
                <button
                  onClick={handleLikeClick}
                  className="absolute top-3 right-3 grid place-items-center rounded-full bg-white/90 backdrop-blur h-10 w-10 shadow-sm"
                >
                  {liked ? (
                    <AiFillHeart className="text-red-500 text-2xl" />
                  ) : (
                    <AiOutlineHeart className=" text-2xl text-gray-700" />
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
              className="w-full text-sm sm:text-base font-raleway text-[#02343F] bg-[#F0EDCC] hover:bg-[#e6e3bf] py-2"
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
              className="absolute w-full top-[280px] sm:top-[300px] bottom-0 left-0 right-0 overflow-auto  bg-[#02343F] px-4 space-y-2 text-lg text-gray-700 border-t border-gray-300 font-raleway py-4"
            >
              <div className="h-full flex-col justify-between  bg-gray-200 rounded-2xl px-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <span className="text-lg text-center bg-gray-100 shadow-sm rounded-lg">
                    Driving
                  </span>
                  <span className="text-lg text-center bg-gray-100 shadow-sm rounded-lg">
                    Bicycle
                  </span>
                  <span className="text-lg text-center bg-gray-100 shadow-sm rounded-lg">
                    Walking
                  </span>
                </div>

                {property.travelTimes && property.travelTimes.length > 0 ? (
                  <ul className="space-y-1 flex flex-col">
                    {property.travelTimes.map((time, index) => (
                      <li key={index} className="flex">
                        <span className="text-xl pr-5">
                          {time.duration} to{}
                        </span>
                        <span className="italic text-xl">
                          {searchDestinations[index]?.label || time.destination}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No travel time available</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="card-body flex flex-col flex-1 items-center text-center sm:items-start sm:text-left px-4">
          <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto] items-start gap-3 sm:gap-4 text-gray-600">
            <h2
              className="w-full text-left font-thin
                text-base sm:text-xl md:text-2xl
                leading-snug break-words"
              title={property.location}
            >
              {property.location}
            </h2>

            {/* Price pill */}
            <div className="flex items-center justify-start md:justify-end gap-2 sm:gap-3">
              <span
                className="rounded px-1 py-0.5 sm:px-3 sm:py-1
                  text-xs sm:text-sm md:text-base
                  bg-[#02343F] text-white font-raleway"
              >
                Price
              </span>
              <span
                className="rounded font-semibold font-raleway
                  px-1 py-0.5 sm:px-3 sm:py-1
                  text-xs sm:text-sm md:text-base
                  bg-[#f0edcc] text-[#02343F]"
              >
                £{property.price_per_month}pm
              </span>
            </div>
          </div>
          <div className="w-full flex justify-start">
            <p
              className="font-raleway text-left text-sm sm:text-base md:text-xl
+               sm:mb-2 md:mb-4 text-[#02343F]"
            >
              {property.title}
            </p>
          </div>

          <div className="w-full flex justify-end md:w-full md:flex md:justify-end mt-auto">
            <button
              type="button"
              className="w-full md:w-auto btn bg-[#02343F] text-white hover:bg-[#F0EDCC] hover:text-black 
             font-raleway text-md md:text-xl font-thin mt-2 rounded-md"
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
