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

  return (
    <>
      <div className="flex flex-col md:flex-row w-full max-w-7xl  ml-10 gap-4">
        {/* Main Image */}

        <>
          <div className="flex-1">
            <img
              src={getTransformedUrl(images[currentIndex], 800, 600)}
              alt={`Property image ${currentIndex + 1}`}
              className="w-full h-[600px] object-cover rounded-xl"
            />
          </div>

          {/*Vertical thumbnail stack*/}
          <div className="w-24 flex flex-col items-center gap-2">
            <button onClick={goToPrevImage}>
              <MdOutlineArrowCircleLeft className="w-6 h-6 text-gray-500 hover:text-black" />
            </button>

            {images.map((image, index) => (
              <img
                key={index}
                src={getTransformedUrl(image, 200, 150)}
                onClick={() => handleSelect(index)}
                loading="lazy"
                fetchPriority="high"
                className={`w-full h-20 object-cover rounded-md cursor-pointer border-2 ${
                  index === currentIndex ? "border-black" : "border-transparent"
                }`}
              />
            ))}

            <button onClick={goToNextImage}>
              <MdOutlineArrowCircleRight className="w-6 h-6 text-gray-500 hover:text-black" />
            </button>
          </div>
        </>
      </div>
    </>
  );
}

export default ImageGallery;
