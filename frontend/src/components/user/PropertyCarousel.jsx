import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
function PropertyCarousel({ properties }) {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 640 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 640, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  const handleSelect = (property) => {
    navigate(`/properties/${property.id}`, {
      state: { property }, // passing property object to user property page
    });
  };

  const getTransformedUrl = (url, width = 800, height = 600) => {
    return url.replace(
      "/upload/",
      `/upload/w_${width},h_${height},c_fill,f_auto,q_auto/`
    );
  };

  console.log(properties);

  return (
    <div className="my-8 mx-36 flex flex-col sm:block">
      <h2 className="text-5xl sm:text-5xl font-bold py-12 px-8 text-center">
        Featured Properties
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties
          .slice(0, showAll ? properties.length : 6)
          .map((property) => (
            <div
              key={property.id}
              className="border rounded-md shadow-md overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
            >
              <img
                src={getTransformedUrl(property.imageUrls[0], 600, 400)}
                alt={property.name}
                className="w-full h-60 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{property.location}</h3>
                <p className="text-lg">{property.description}</p>
                <p className="text-xl text-gray-600 font-bold ">
                  £{property.price_per_month}
                </p>
                <div className="flex justify-end">
                  <button
                    className="btn rounded-lg px-5 py-4 bg-[#02343F] text-white hover:bg-[#F0EDCC] hover:text-black"
                    onClick={() => handleSelect(property)}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {!showAll && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll(true)}
            className="px-9 py-4 bg-[#02343F] text-white text-4xl rounded-md hover:bg-[#F0EDCC] hover:text-black hover:border transition mb-10"
          >
            View More
          </button>
        </div>
      )}
    </div>
  );
}

export default PropertyCarousel;
