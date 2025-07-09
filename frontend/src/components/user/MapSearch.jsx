import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import UserAutocomplete from "./UserAutocomplete";
import { useTravelStore } from "../../utils/useTravelStore";
import { useEffect, useState } from "react";
import { FaCar, FaWalking, FaBus } from "react-icons/fa";
import { IoIosBicycle } from "react-icons/io";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];

function MapSearch({ property }) {
  const travelResults = useTravelStore((state) => state.travelResults);

  const [selectedTransport, setSelectedTransport] = useState([
    null,
    null,
    null,
  ]);
  const [destinations, setDestinations] = useState([
    { lat: null, lng: null },
    {},
    {},
  ]);
  const [directions, setDirections] = useState({});

  const modeIcons = {
    car: (
      <FaCar className="text-gray-500 text-[20px] size-10 hover:text-gray-700" />
    ),
    bus: (
      <FaBus className="text-gray-500 text-[20px] size-10 hover:text-gray-700" />
    ),
    walking: (
      <FaWalking className="text-gray-500 text-[20px] size-10 hover:text-gray-700" />
    ),
    bicycle: (
      <IoIosBicycle className="text-gray-500 text-[20px] size-10 hover:text-gray-700" />
    ),
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (!isLoaded) return <div className="loading loading-spinner" />;

  const handleInputChange = (index, place) => {
    const newDestinations = [...destinations];
    newDestinations[index] = place;
    setDestinations(newDestinations);
  };

  const handleTransportSelect = (index, mode) => {
    const newSelectedTransports = [...selectedTransport];
    newSelectedTransports[index] = mode;
    setSelectedTransport(newSelectedTransports);
  };

  const center = {
    lat: property.latitude,
    lng: property.longitude,
  };

  const origin = {
    lat: property.latitude,
    lng: property.longitude,
  };

  const containerStyle = {
    width: "70%",
    height: "400px",
  };

  const showRoute = (destination) => {
    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          console.log("Route result:", result);
          setDirections(result);
        } else {
          console.error("Route Failed");
        }
      }
    );
  };

  return (
    <>
      <div className="h-auto   shadow-xl  border-2 mb-10  mx-20  rounded-2xl font-raleway">
        <div className="flex flex-row w-full h-full p-8 gap-10 ">
          {/* sidebar for inputs */}
          <div className="flex flex-col md:w-1/2 pr-14 gap-10 w-full h-full  rounded-2xl ">
            <h1 className="text-3xl text-black">{property.location}</h1>
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex space-x-2 items-center justify-between"
              >
                <UserAutocomplete
                  onPlaceSelect={(place) => {
                    const lat = place.latitude;
                    const lng = place.longitude;
                    handleInputChange(index, { lat, lng });
                  }}
                  className="rounded-md border-2 mr-10"
                />
                <div className="dropdown dropdown-bottom relative">
                  <label
                    tabIndex={0}
                    className="btn m-1 rounded-md h-14 w-28 border-2 border-[#02343F]"
                  >
                    {selectedTransport[index]
                      ? modeIcons[selectedTransport[index]]
                      : "Transport"}
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content absolute z-[1] left-1/2 transform -translate-x-1/2  menu p-2 shadow bg-base-100 rounded-box w-auto border-2 border-[#02343F] justify-center"
                  >
                    <li onClick={() => handleTransportSelect(index, "car")}>
                      <FaCar className="text-gray-500 text-[20px] size-16 hover:text-gray-700" />
                    </li>
                    <li onClick={() => handleTransportSelect(index, "bus")}>
                      <FaBus className="text-gray-500 text-[20px] size-16 hover:text-gray-700" />
                    </li>
                    <li onClick={() => handleTransportSelect(index, "walking")}>
                      <FaWalking className="text-gray-500 text-[20px] size-16 hover:text-gray-700" />
                    </li>
                    <li onClick={() => handleTransportSelect(index, "bicycle")}>
                      <IoIosBicycle className="text-gray-500 text-[20px] size-16 hover:text-gray-700" />
                    </li>
                  </ul>
                </div>
                <button
                  className="btn btn-primary rounded-md h-14 bg-[#02343F] text-white hover:bg-[#F0EDCC] hover:text-black"
                  type="button"
                  onClick={() => showRoute(destinations[index])}
                >
                  SHOW ROUTE
                </button>
              </div>
            ))}
          </div>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
          >
            <DirectionsRenderer directions={directions} />
          </GoogleMap>
        </div>
      </div>
    </>
  );
}

export default MapSearch;
