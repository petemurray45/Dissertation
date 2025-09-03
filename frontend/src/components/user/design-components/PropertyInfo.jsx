import react from "react";
import { useUserStore } from "../../../utils/useUserStore";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PropertyInfo({
  property,
  isLiked,
  onToggleLike,
  agencyLogoUrl,
  agencyName,
}) {
  const addressSplit = property.location.split(",");
  const { user } = useUserStore();
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate("");

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const handleLikeClick = () => {
    setLiked(!liked);
    onToggleLike(property);
  };
  return (
    <div className="rounded-2xl min-w-[300px] font-raleway">
      <div>
        <div className="grid grid-cols-1 md:flex-row">
          <div>
            <h1
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-gray-300 py-2 md:py-3 font-semibold"
              data-testid="property-title"
            >
              {addressSplit[0]},
            </h1>
            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl text-gray-200 py-1 md:py-3 font-thin">
              {addressSplit[1]}
            </h1>
          </div>
          <div className="mt-2 mb-4 md:mb-0 md:mt-0">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-gray-200 py-2 md:py-3 font-semibold">
              £{property.price_per_month}
            </h1>
          </div>
        </div>

        <div className="bg-gray-300 px-2 py-2 rounded-2xl">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full p-4 sm:p-6 text-base sm:text-lg md:text-xl bg-gray-200 rounded-2xl shadow-xl border-gray-300">
            <p>Price:</p>
            <p className="text-end" data-testid="property-price">
              £{property.price_per_month}
            </p>
            <p>Property Type:</p>
            <p className="text-end">{property.property_type}</p>
            <p>En suite:</p>
            <p className=" text-end" data-testid="badge-ensuite">
              {property.ensuite ? "Yes" : "No"}
            </p>
            <p>Bed Type:</p>
            <p className=" text-end">{property.bed_type}</p>
            <p>Wifi:</p>
            <p className="text-end" data-testid="badge-wifi">
              {property.wifi ? "Yes" : "No"}
            </p>
            <p>Pet Friendly</p>
            <p className="text-end" data-testid="badge-pets">
              {property.pets ? "Yes" : "No"}
            </p>
          </div>
        </div>

        {!user ? (
          <div className="flex flex-col sm:flex-row justify-center items-center w-full mt-5 px-4 sm:px-5 gap-3 sm:gap-7">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl">
                Want to save this for later?
              </h1>
            </div>
            <button
              className="btn rounded-md h-14 w-38 text-xl bg-[#02343F] hover:bg-[#F0EDCC] hover:text-black shadow-md text-white "
              onClick={() => navigate("/login")}
            >
              Log in now
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-between items-center w-full text-gray-200 mt-6 px-4 sm:px-5 gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl">Like this property?</h1>
              <p className="text-lg sm:text-2xl mt-1 sm:mt-2">
                Save it for later.
              </p>
            </div>
            <div className="flex  justify-center items-center ">
              <button onClick={handleLikeClick}>
                {isLiked ? (
                  <AiFillHeart className="text-red-500 drop-shadow-sm text-4xl sm:text-5xl md:text-6xl hover:animate-beat" />
                ) : (
                  <AiOutlineHeart className="hover:text-red-500 text-4xl sm:text-5xl md:text-6xl hover:animate-beat" />
                )}
              </button>
            </div>
          </div>
        )}
        <div className="w-full h-auto flex items-center gap-4 md:gap-8">
          <img
            src={property.logo_url}
            className="h-24 w-24 md:h-36 md:w-36 rounded-2xl mt-5"
          />
          <span className="font-raleway text-gray-100 text-xl md:text-4xl">
            {property.agency_name}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PropertyInfo;
