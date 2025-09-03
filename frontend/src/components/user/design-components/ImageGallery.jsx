import { useState } from "react";
import {
  MdOutlineArrowCircleLeft,
  MdOutlineArrowCircleRight,
} from "react-icons/md";

function ImageGallery({ images, agencyLogoUrl, agencyName }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleSelect = (index) => setCurrentIndex(index);

  const getTransformed = (url, w = 1300, h = 800) => {
    if (!url || typeof url !== "string") return url;
    return url.includes("/upload/")
      ? url.replace("/upload/", `/upload/w_${w},h_${h},c_fill,f_auto,q_auto/`)
      : url;
  };

  const getLogoTransformed = (url, w = 200, h = 200) => {
    if (!url || typeof url !== "string") return url;
    return url.includes("/upload/")
      ? url.replace("/upload/", `/upload/w_${w},h_${h},c_fit,f_auto,q_70/`)
      : url;
  };

  // guard
  if (!images || !Array.isArray(images) || images.length === 0) {
    return <div className="text-center w-full py-8">No images available</div>;
  }

  const goToNextImage = () => {
    if (images) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  const goToPrevImage = () => {
    if (images) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length
      );
    }
  };

  const galleryWidthClass = "max-w-[1100px]";

  return (
    <>
      <div className={`flex flex-col w-full gap-4 px-4 sm:px-6 tab:px-8 `}>
        {/* Main Image */}

        <>
          <div className="aspect-[13/8] w-full  relative overflow-hidden">
            <img
              src={getTransformed(images[currentIndex], 1300, 800)}
              alt={`Property image ${currentIndex + 1}`}
              className="w-full h-full object-cover rounded-lg shadow-2xl"
            />

            {agencyLogoUrl && (
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3  z-20 w-40 h-36 sm:w-28 sm:h-24 md:w-36 md:h-28 bg-white/80 backdrop-blur-sm p-2 rounded-md shadow">
                <img
                  src={getLogoTransformed(agencyLogoUrl)}
                  alt={agencyName ? `${agencyName} logo` : "Agency logo"}
                  className="w-full h-full object-contain"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}

            {/* Previous Button */}
            {images.length > 1 && (
              <button
                onClick={goToPrevImage}
                className="absolute top-1/2 left-1 sm:left-2 -translate-y-1/2 bg-gray-800 text-white p-1 sm:p-2 rounded-full opacity-80 hover:opacity-100 z-10"
              >
                <MdOutlineArrowCircleLeft className="size-10" />
              </button>
            )}

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={goToNextImage}
                className="absolute top-1/2 right-1 sm:right-2 -translate-y-1/2 bg-gray-800 text-white p-1 sm:p-2 rounded-full opacity-80 hover:opacity-100 z-10"
              >
                <MdOutlineArrowCircleRight className="size-10" />
              </button>
            )}
          </div>
        </>
      </div>
    </>
  );
}

export default ImageGallery;
