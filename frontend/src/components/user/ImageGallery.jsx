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
      <div className="flex flex-col w-full max-w-screen mr-20 gap-4 ">
        {/* Main Image */}

        <>
          <div className="flex px-16">
            <img
              src={getTransformedUrl(images[currentIndex], 1000, 800)}
              alt={`Property image ${currentIndex + 1}`}
              className="sm:h-[200px] md:h-[800px] object-cover "
            />
          </div>

          {/*Vertical thumbnail stack*/}
          <div className="w-[100%] justify-center flex flex-row items-center   gap-2 mt-5">
            <button onClick={goToPrevImage}>
              <MdOutlineArrowCircleLeft className="w-14 h-14 text-[#02343F] hover:text-gray-400" />
            </button>

            {images.map((image, index) => (
              <img
                key={index}
                src={getTransformedUrl(image, 200, 150)}
                onClick={() => handleSelect(index)}
                loading="lazy"
                fetchPriority="high"
                className={`w-[80px] h-[60px] md:w-[200px] md:h-[200px] object-cover rounded-md cursor-pointer border-2 ${
                  index === currentIndex
                    ? "border border-gray-600"
                    : "border-transparent"
                }`}
              />
            ))}

            <button onClick={goToNextImage}>
              <MdOutlineArrowCircleRight className="w-14 h-14 text-[#02343F] hover:text-gray-400" />
            </button>
          </div>
        </>
      </div>
    </>
  );
}

export default ImageGallery;
