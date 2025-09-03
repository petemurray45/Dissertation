import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUserStore } from "../../../utils/useUserStore";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import PropertyTile from "./PropertyTile";

function PropertyCarousel({ properties }) {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const { addToLikes, likedPropertyIds, user } = useUserStore();

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

  const toggleLike = async (property) => {
    if (!user) return;
    try {
      await addToLikes(property);
      console.log("property liked:", property.id);
    } catch (err) {
      console.log("Failed to like property", property.id);
    }
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
    <div className="my-8 mx-auto max-w-screen-2xl  px-8 sm:px-6 lg:px-12 flex flex-col sm:block">
      <h2 className="text-3xl md:text-4xl lg:text-6xl py-12 px-8 text-center font-raleway font-thin text-gray-200 text-shadow-lg ">
        Featured Properties
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {properties
          .slice(0, showAll ? properties.length : 6)
          .map((property) => (
            <PropertyTile
              property={property}
              key={property.id}
              onToggleLike={() => toggleLike(property)}
              isLiked={likedPropertyIds.includes(property.id)}
            />
          ))}
      </div>

      {!showAll && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll(true)}
            className="px-9 py-4 bg-[#02343F] text-white text-4xl rounded-md hover:bg-[#F0EDCC] hover:text-black hover:border transition mb-10 font-raleway"
          >
            View More
          </button>
        </div>
      )}
    </div>
  );
}

export default PropertyCarousel;
