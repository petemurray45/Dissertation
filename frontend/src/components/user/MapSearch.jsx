import { GoogleMap, Marker } from "@react-google-maps/api";
import UserAutocomplete from "./UserAutocomplete";

function MapSearch({ property }) {
  const center = {
    lat: property.latitude,
    lng: property.longitude,
  };
  return (
    <>
      <div className="h-[70%] bg-gray-200  shadow-2xl  border-2 mb-10 mt-9 mx-20  rounded-2xl font-raleway">
        <div className="flex flex-row w-full h-full p-8 gap-10 ">
          {/* sidebar for inputs */}

          <div className="flex flex-col md:w-2/3 pr-14 gap-10 w-full h-full  rounded-2xl ">
            <h1 className="text-3xl text-black">
              {property.location} is 14 minutes by car.
            </h1>
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex space-x-2 items-center justify-between"
              >
                <input
                  type="text"
                  className="flex-1 w-full p-2 border-2 rounded-xl h-14 text-xl hover:border-[#02343F]  focus:outline-none"
                  placeholder="Enter a location..."
                />
                <button className="btn btn-primary rounded-md h-14 bg-[#02343F] text-white hover:bg-[#F0EDCC] hover:text-black">
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
