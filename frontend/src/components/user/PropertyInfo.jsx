import react from "react";
import { useUserStore } from "../../utils/useUserStore";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PropertyInfo({ property, isLiked, onToggleLike }) {
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
    <div className="   rounded-2xl min-w-[300px] font-raleway">
      <div>
        <div className="grid grid-cols-1 md:flex-row">
          <div>
            <h1 className="text-5xl text-gray-300 py-3 font-semibold">
              {addressSplit[0]},
            </h1>
            <h1 className="text-4xl text-gray-200 py-3 font-thin ">
              {addressSplit[1]}
            </h1>
          </div>
          <div>
            <h1 className="text-5xl text-gray-200 py-3  font-semibold">
              £{property.price_per_month}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-2 shadow-xl border-gray-300 bg-gray-200 rounded-lg gap-10 w-[100%] p-6 mt-6 text-xl">
          <p>Price:</p>
          <p className="text-end">£{property.price_per_month}</p>
          <p>Property Type:</p>
          <p className="text-end">{property.property_type}</p>
          <p>En suite:</p>
          <p className=" text-end">{property.ensuite ? "Yes" : "No"}</p>
          <p>Bed Type:</p>
          <p className=" text-end">{property.bed_type}</p>
          <p>Wifi:</p>
          <p className="text-end">{property.wifi ? "Yes" : "No"}</p>
          <p>Pet Friendly</p>
          <p className="text-end">{property.pets ? "Yes" : "No"}</p>
        </div>

        {!user ? (
          <div className="flex justify-center items-center  w-full  mt-5 px-5 gap-7">
            <div className="flex-col px-5 py-10">
              <h1 className="text-2xl">Want to save this for later?</h1>
            </div>
            <div className="flex  justify-center items-center ">
              <button
                className="btn rounded-md h-14 w-38 text-xl bg-[#02343F] hover:bg-[#F0EDCC] hover:text-black shadow-md text-white "
                onClick={() => navigate("/login")}
              >
                Log in now
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center w-full text-gray-200   mt-8 px-5">
            <div className="flex-col px-5">
              <h1 className="text-3xl">Like this property?</h1>
              <p className="text-2xl mt-2">Save it for later.</p>
            </div>
            <div className="flex  justify-center items-center ">
              <button onClick={handleLikeClick}>
                {isLiked ? (
                  <AiFillHeart className="text-red-500 drop-shadow-sm text-6xl hover:animate-beat" />
                ) : (
                  <AiOutlineHeart className=" hover:text-red-500 text-6xl hover:animate-beat" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyInfo;
