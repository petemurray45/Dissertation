import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa6";
import searchIcon from "../../assets/search.png";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Car } from "lucide-react";

function LocationCarousel({ properties }) {
  const navigate = useNavigate();

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
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

  const getTransformedUrl = (url, width = 800, height = 600) => {
    return url.replace(
      "/upload/",
      `/upload/w_${width},h_${height},c_fill,f_auto,q_auto/`
    );
  };

  const belfastUrl = getTransformedUrl(
    "https://images.unsplash.com/photo-1593255136145-da399169fadd?q=80&w=1828&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );
  const londonUrl = getTransformedUrl(
    "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );
  const lisburnUrl = getTransformedUrl(
    "https://images.squarespace-cdn.com/content/v1/66ebf26bb71de97b5129aa57/56fe7d82-73c9-4a5e-a55b-5840fcae66ea/Lisburn+City.jpg"
  );
  const manUrl = getTransformedUrl(
    "https://images.unsplash.com/photo-1724135869739-6055627ba5df?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );
  const dubUrl = getTransformedUrl(
    "https://images.unsplash.com/photo-1605969353711-234dea348ce1?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );
  const liverpoolUrl = getTransformedUrl(
    "https://images.unsplash.com/photo-1726410238762-2388af04eadb?q=80&w=1843&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );

  return (
    <div className="my-8 mx-36 flex flex-col sm:block">
      <div className=" flex flex-col sm:block w-full ">
        <h2 className="text-5xl sm:text-5xl font-bold py-12  text-center">
          Popular Locations
        </h2>
        <div className="grid grid-cols-6 gap-4 h-[800px]  mx-auto ">
          {/* Large Card - spans 3 cols and 2 rows */}
          <div
            className=" col-span-3 row-span-2  p-4 shadow rounded-lg flex items-center justify-center relative transform transition duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
            style={{
              backgroundImage: `url(${belfastUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h3 className="text-6xl font-semibold text-white absolute text-shadow-lg ">
              Belfast
            </h3>
          </div>

          {/* Smaller Cards */}
          <div
            className="col-span-3 bg-white p-4 shadow rounded-lg flex items-center justify-center relative transform transition duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
            style={{
              backgroundImage: `url(${liverpoolUrl}})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h3 className="text-6xl text-white text-shadow-lg font-semibold absolute">
              Liverpool
            </h3>
          </div>

          <div
            className="col-span-3 bg-white p-4 shadow rounded-lg flex items-center justify-center relative transform transition duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
            style={{
              backgroundImage: `url(${lisburnUrl}})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h3 className="text-6xl text-white text-shadow-lg font-semibold absolute">
              Lisburn
            </h3>
          </div>

          <div
            className="row-span-3 col-span-2 bg-white p-4 shadow rounded-lg flex items-center justify-center relative transform transition duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
            style={{
              backgroundImage: `url(${dubUrl}})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h3 className="text-6xl text-white text-shadow-lg absolute font-semibold ">
              Dublin
            </h3>
          </div>

          <div
            className="row-span-3 col-span-2 bg-white p-4 shadow rounded-lg flex items-center justify-center relative transform transition duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
            style={{
              backgroundImage: `url(${manUrl}})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h3 className="text-6xl text-white text-shadow-lg absolute font-semibold ">
              Manchester
            </h3>
          </div>
          <div
            className="col-span-2 row-span-3 bg-white p-4 shadow rounded-lg flex items-center justify-center relative transform transition duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
            style={{
              backgroundImage: `url(${londonUrl}})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h3 className="text-6xl text-white text-shadow-lg absolute font-semibold ">
              London
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationCarousel;
