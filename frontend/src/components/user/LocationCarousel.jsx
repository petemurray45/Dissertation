import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "react-multi-carousel/lib/styles.css";

function LocationCarousel({ properties }) {
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

  const cities = [
    { name: "Belfast", image: belfastUrl, colSpan: "3", rowSpan: "2" },
    { name: "Liverpool", image: liverpoolUrl, colSpan: "3", rowSpan: "1" },
    { name: "Lisburn", image: lisburnUrl, colSpan: "3", rowSpan: "1" },
    { name: "Dublin", image: dubUrl, colSpan: "2", rowSpan: "3" },
    { name: "Manchester", image: manUrl, colSpan: "2", rowSpan: "3" },
    { name: "London", image: londonUrl, colSpan: "2", rowSpan: "3" },
  ];

  return (
    <div className="my-8 mx-36 flex flex-col sm:block">
      <div className=" flex flex-col sm:block w-full ">
        <h2 className="text-5xl sm:text-5xl py-12  text-center font-raleway font-thin">
          Popular Locations
        </h2>
        <div className="grid grid-cols-6 grid-rows-3 gap-4 h-[900px]   mx-auto ">
          {/* Large Card - spans 3 cols and 2 rows */}
          {cities.map(({ name, image, colSpan, rowSpan }) => (
            <>
              <Link
                key={name}
                to={`/properties?destination=${encodeURIComponent(
                  name
                )}&maxPrice=10000`}
                className={`p-4 shadow rounded-lg flex items-center justify-center relative transform transition duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer col-span-${colSpan} row-span-${rowSpan}`}
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="flex justify-center items-center">
                  <div className="absolute inset-0 bg-black opacity-20 mix-blend-multiply z-10"></div>

                  <h3 className="text-6xl font-normal text-white absolute text-shadow-lg z-20 font-raleway">
                    {name}
                  </h3>
                </div>
              </Link>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LocationCarousel;
