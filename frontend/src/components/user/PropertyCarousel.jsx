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

  const getTransformedUrl = (url, width = 800, height = 600) => {
    return url.replace(
      "/upload/",
      `/upload/w_${width},h_${height},c_fill,f_auto,q_auto/`
    );
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
              className="bg-[#02343F] text-white rounded-lg shadow-xl overflow-hidden max-h-[400px] min-h-[350px] min-w-[400px]"
            >
              <img
                src={getTransformedUrl(property.imageUrls[0], 250, 100)}
                alt={property.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 py-4">
                <h3 className="font-bold text-lg">{property.title}</h3>
                <p className="text-white-300">{property.location}</p>
                <p className="text-white font-semibold">
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
