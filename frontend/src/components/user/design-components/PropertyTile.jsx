import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  MdOutlineArrowCircleLeft,
  MdOutlineArrowCircleRight,
} from "react-icons/md";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useListingStore } from "../../../utils/useListingsStore";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaCarAlt } from "react-icons/fa";
import { BsPersonWalking } from "react-icons/bs";
import { IoBicycleOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useTravelStore } from "../../../utils/useTravelStore";
import { useUserStore } from "../../../utils/useUserStore";

function PropertyTile({
  property,
  isLiked,
  onToggleLike,
  isOpen,
  onToggleOpen,
}) {
  const hasImages = property.imageUrls && property.imageUrls.length > 0;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showLikeMessage, setShowLikeMessage] = useState(false);
  const [likeMessageText, setLikeMessageText] = useState("");
  const [mode, setMode] = useState("driving");

  const { searchDestinations } = useTravelStore();
  const { travelSearchSubmitted } = useListingStore();
  const { user } = useUserStore();

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const navigate = useNavigate();

  const handleSelect = (property) => {
    navigate(`/properties/${property.id}`, {
      state: { property },
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

  return (
    <>
      <div
        className="relative flex flex-col h-auto md:h-[30rem] rounded-2xl bg-white shadow-md ring-1 ring-black/5 overflow-hidden"
        data-testid="property-tile"
        data-has-multi={property.imageUrls?.length > 1 ? "true" : "false"}
      >
        <div className="relative h-56 sm:h-64 w-full">
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
              <div className="absolute bottom-16 left-3 bg-white/85 backdrop-blur rounded-md p-1 shadow-sm">
                <img
                  src={safeTransform(property.logo_url, 350, 200)}
                  alt="agency logo"
                  className="h-20 w-20 object-contain"
                />
              </div>
              {property.imageUrls.length > 1 && (
                <>
                  <button
                    aria-label="previous"
                    data-testid="previous-image"
                    onClick={goToPrevImage}
                    className="absolute top-1/2 -translate-y-1/2 left-2 rounded-full bg-black/55 text-white p-1"
                  >
                    <MdOutlineArrowCircleLeft className="text-2xl" />
                  </button>
                  <button
                    aria-label="next"
                    data-testid="next-image"
                    onClick={goToNextImage}
                    className="absolute top-1/2 -translate-y-1/2 right-2 rounded-full bg-black/55 text-white p-1"
                  >
                    <MdOutlineArrowCircleRight className="text-2xl" />
                  </button>
                </>
              )}
              {user && (
                <button
                  onClick={handleLikeClick}
                  data-testid="like-button"
                  aria-label={liked ? "unlike" : "like"}
                  className="absolute top-3 right-3 grid place-items-center rounded-full bg-white/90 backdrop-blur h-10 w-10 shadow-sm"
                >
                  {liked ? (
                    <AiFillHeart
                      data-testid="liked-icon"
                      className="text-red-500 text-2xl"
                    />
                  ) : (
                    <AiOutlineHeart
                      data-testid="unliked-icon"
                      className="text-2xl text-gray-700"
                    />
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
              onClick={onToggleOpen}
              className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-2
               text-sm sm:text-base font-raleway text-gray-200 bg-[#02343F] py-2"
            >
              {isOpen ? "Hide Travel Times" : "Show Travel Times"}
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>

        <div className="card-body relative flex flex-col flex-1 items-center text-center sm:items-start sm:text-left px-4">
          <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto] items-start gap-3 sm:gap-4 text-gray-600">
            <h2
              className="w-full text-left font-thin text-base sm:text-xl md:text-2xl leading-snug break-words"
              title={property.location}
            >
              {property.location}
            </h2>
            <div className="flex items-center justify-start md:justify-end gap-2 sm:gap-3">
              <span className="rounded px-1 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm md:text-base bg-[#02343F] text-white font-raleway">
                Price
              </span>
              <span className="rounded font-semibold font-raleway px-1 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm md:text-base bg-[#f0edcc] text-[#02343F]">
                £{property.price_per_month}pm
              </span>
            </div>
          </div>
          <div className="w-full flex justify-start">
            <p className="font-raleway text-left text-sm sm:text-base md:text-xl sm:mb-2 md:mb-4 text-[#02343F]">
              {property.title}
            </p>
          </div>
          <div className="w-full flex justify-end md:w-full md:flex md:justify-end mt-auto">
            <button
              type="button"
              className="w-full md:w-auto btn bg-[#02343F] text-white hover:bg-[#F0EDCC] hover:text-black font-raleway text-md md:text-xl font-thin mt-2 rounded-md"
              onClick={() => handleSelect(property)}
            >
              View
            </button>
          </div>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key={`travel-times-${property.id}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-x-0 bottom-0 z-20 top-0 overflow-y-auto bg-[#02343F] text-gray-200 border-t border-gray-300 py-2 px-2 rounded-b-2xl"
              >
                <div className="h-full flex-col justify-between bg-gray-200 rounded-2xl px-4 py-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-2">
                    <button
                      onClick={() => setMode("driving")}
                      className={`flex justify-center p-2 rounded-md ${
                        mode === "driving"
                          ? "bg-[#02343F] text-white"
                          : "bg-gray-100 text-[#02343F]"
                      }`}
                      type="button"
                    >
                      <FaCarAlt size={20} />
                    </button>
                    <button
                      onClick={() => setMode("bicycling")}
                      className={`flex justify-center p-2 rounded-md ${
                        mode === "bicycling"
                          ? "bg-[#02343F] text-white"
                          : "bg-gray-100 text-[#02343F]"
                      }`}
                      type="button"
                    >
                      <IoBicycleOutline size={20} />
                    </button>
                    <button
                      onClick={() => setMode("walking")}
                      className={`flex justify-center p-2 rounded-md ${
                        mode === "walking"
                          ? "bg-[#02343F] text-white"
                          : "bg-gray-100 text-[#02343F]"
                      }`}
                      type="button"
                    >
                      <BsPersonWalking size={20} />
                    </button>
                  </div>
                  {Array.isArray(property.travelTimes) &&
                  property.travelTimes.length > 0 ? (
                    <ul className="space-y-2">
                      {property.travelTimes
                        .filter((t) => t.mode === mode)
                        .map((t) => (
                          <li
                            key={`${t.mode}-${t.destination}`}
                            className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg shadow-sm"
                          >
                            <span className="text-md font-medium text-gray-700">
                              {t.duration ?? "N/A"} &#8594;
                            </span>
                            <span className="flex items-center gap-1 text-md italic text-gray-600">
                              {t.destination}
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
        </div>
      </div>
    </>
  );
}

export default PropertyTile;
