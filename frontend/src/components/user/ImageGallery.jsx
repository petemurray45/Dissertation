import { useState } from "react";
import {
  MdOutlineArrowCircleLeft,
  MdOutlineArrowCircleRight,
} from "react-icons/md";

function ImageGallery({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleSelect = (index) => setCurrentIndex(index);

  // image transformation to increase performence
  const getTransformedUrl = (url, width = 800, height = 600) => {
    return url.replace(
      "/upload/",
      `/upload/w_${width},h_${height},c_fill,f_auto,q_auto/`
    );
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
      <div className={`flex flex-col w-full gap-4 ${galleryWidthClass}`}>
        {/* Main Image */}

        <>
          <div className="aspect-[13/8] w-full max-w-[1300px] relative overflow-hidden">
            <img
              src={getTransformedUrl(images[currentIndex], 1300, 800)}
              alt={`Property image ${currentIndex + 1}`}
              className="w-full h-full object-cover rounded-lg border-2"
            />

            {/* Previous Button */}
            {images.length > 1 && (
              <button
                onClick={goToPrevImage}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100 z-10 mx-5"
              >
                <MdOutlineArrowCircleLeft className="size-10" />
              </button>
            )}

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={goToNextImage}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100 z-10 mx-5"
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
