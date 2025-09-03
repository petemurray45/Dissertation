import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import mac from "../../../assets/mac.png";
import { FaArrowDown } from "react-icons/fa";
import { useState } from "react";
import UserAutocomplete from "../user-actions/UserAutocomplete";

function Hero() {
  const searchBar = document.getElementById("search");

  const [destination, setDestination] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [radius, setRadius] = useState("10");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!destination) return;

    const query = new URLSearchParams({
      location: destination.label,
      lat: destination.latitude,
      lng: destination.longitude,
      minPrice: minPrice ? Number(minPrice) : "",
      maxPrice: maxPrice ? Number(maxPrice) : "",
      radius,
    });

    navigate(`/properties?${query.toString()}`);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center font-raleway min-h-screen pt-96 px-4 sm:px-6 md:px-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 items-center w-full gap-10 px-4 sm:px-6 md:px-8 mx-20">
          <div className="flex justify-center lg:justify-end w-full">
            <picture>
              <img
                src={mac}
                className="w-full max-w-[700px] md:max-w-[500px] lg:max-w-[700px] h-auto object-contain"
                alt="Mac mockup"
              />
              <source
                type="image/avif"
                srcSet="/img/hero-mac-480.avif 480w, /img/hero-mac-768.avif 768w, /img/hero-mac-1200.avif 1200w"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 600px"
              />
              <source
                type="image/webp"
                srcSet="/img/hero-mac-480.webp 480w, /img/hero-mac-768.webp 768w, /img/hero-mac-1200.webp 1200w"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 600px"
              />
            </picture>
          </div>

          <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left gap-6">
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-7xl text-gray-200 text-shadow-xl">
              PropertyApp
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-gray-200 max-w-prose">
              Searching for a room that suits you has never been easier.
            </p>
            <div className="flex flex-col justify-center items-center sm:flex-row gap-4">
              <button
                className="btn border-none bg-[#02343F] text-white rounded-md px-6 py-3 text-lg sm:text-xl text-center"
                type="button"
                data-testid="hero-scroll"
                onClick={() =>
                  searchBar?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Search Now <FaArrowDown className="ml-2" />
              </button>
              <button
                className="btn border-none bg-[#e3d6a1] text-black rounded-md px-6 py-3 text-center text-lg sm:text-xl"
                onClick={() => navigate("/properties")}
              >
                View All Rooms <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-96 sm:mt-32 lg:mt-96 scroll-mt-40 w-full  max-w-[1700px]">
          <form
            className="bg-[#02343F] shadow-2xl py-4 px-4 rounded-xl flex flex-col lg:flex-row flex-wrap items-center justify-between mx-auto  gap-4 w-full"
            id="search"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full">
              <div className="flex flex-col sm:flex-row gap-1 w-full lg:flex-grow lg:max-w-[50%]">
                <UserAutocomplete
                  dataTestId="hero-location"
                  onPlaceSelect={({ location, latitude, longitude }) =>
                    setDestination({ label: location, latitude, longitude })
                  }
                  className="rounded-md border-2 px-4 py-3 w-full flex-1 text-base lg:h-24 md:h-16 sm:h-12 lg:text-4xl md:text-2xl sm:text-xl"
                  placeholder="Enter a location"
                />
                <select
                  data-testid="hero-distance"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className="rounded-md border-2 px-4 py-3 w-full sm:w-36 text-base sm:text-lg md:text-2xl lg:text-3xl"
                >
                  <option value="5">5 km</option>
                  <option value="10">10 km</option>
                  <option value="15">15 km</option>
                  <option value="20">20 km</option>
                  <option value="30">30 km</option>
                </select>
              </div>

              <input
                type="number"
                data-testid="hero-max-price"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="rounded-md border-2 px-4 py-3 w-full flex-1 sm:w-40 text-base lg:h-24 md:h-16 sm:h-12 sm:text-lg md:text-2xl lg:text-3xl"
              />

              <input
                type="number"
                data-testid="hero-min-price"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="rounded-md border-2 px-4 py-3 w-full flex-1 sm:w-40 text-base lg:h-24 md:h-16 sm:h-12 sm:text-lg md:text-2xl lg:text-3xl"
              />

              <button
                type="submit"
                data-testid="hero-search"
                className="rounded-md   flex-1 bg-[#e3d6a1] text-black hover:bg-[#02343F] hover:text-white hover:border-[#F0EDCC] px-6 py-3 text-base sm:text-lg md:text-2xl lg:text-3xl lg:h-24 md:h-16 sm:h-12 "
              >
                SEARCH
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Hero;
