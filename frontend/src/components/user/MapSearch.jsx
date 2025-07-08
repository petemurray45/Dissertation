import { GoogleMap, Marker } from "@react-google-maps/api";
import UserAutocomplete from "./UserAutocomplete";
import { useTravelStore } from "../../utils/useTravelStore";
import { useEffect, useState } from "react";

function MapSearch({ property }) {
  const [travelTime, setTravelTime] = useState(null);
  const { getTravelTimesForAllRoutes, addDestination, searchDestinations } =
    useTravelStore();

  const center = {
    lat: property.latitude,
    lng: property.longitude,
  };

  const origin = {
    lat: property.latitude,
    lng: property.longitude,
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const results = await getTravelTimesForAllRoutes(origin);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="h-[70%]   shadow-xl  border-2 mb-10 mt-9 mx-20  rounded-2xl font-raleway">
        <div className="flex flex-row w-full h-full p-8 gap-10 ">
          {/* sidebar for inputs */}

          <div className="flex flex-col md:w-1/2 pr-14 gap-10 w-full h-full  rounded-2xl ">
            <h1 className="text-3xl text-black">Build {property.location}</h1>
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex space-x-2 items-center justify-between"
              >
                <UserAutocomplete
                  onPlaceSelect={(value) => addDestination(value)}
                  className="rounded-md border-2"
                />
                <button
                  className="btn btn-primary rounded-md h-14 bg-[#02343F] text-white hover:bg-[#F0EDCC] hover:text-black"
                  type="button"
                  onClick={handleClick}
                >
                  SHOW ROUTE
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default MapSearch;
