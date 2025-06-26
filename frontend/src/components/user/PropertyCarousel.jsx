import React from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
function PropertyCarousel({ properties }) {
  const navigate = useNavigate();

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
    },
  };

  console.log(properties);

  return (
    <>
      <div className="my-8">
        <h2 className="text-6xl font-bold py-8 px-8">Featured Properties</h2>
        <Carousel
          responsive={responsive}
          infinite
          autoPlay={true}
          arrows
          keyBoardControl
          containerClass="carousel-container"
          itemClass="px-4"
        >
          {properties.map((property, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden bg-[#02343F]"
            >
              <img
                src={property.imageUrls[0]}
                alt={property.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{property.title}</h3>
                <p className="text-gray-600">{property.location}</p>
                <p className="text-purple-600 font-semibold">
                  £{property.price_per_month}
                </p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </>
  );
}

export default PropertyCarousel;
