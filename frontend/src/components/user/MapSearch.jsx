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
  const { searchDestinations } = useTravelStore();
  const [activeIndex, setActiveIndex] = useState(null); // to highlight selected
  const [durations, setDurations] = useState([]); // store travel times by index
  const [directions, setDirections] = useState({});
  const [clickedIndex, setClickedIndex] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (!isLoaded) return <div className="loading loading-spinner" />;

  const center = {
    lat: property.latitude,
    lng: property.longitude,
  };

  const origin = {
    lat: property.latitude,
    lng: property.longitude,
  };

  const containerStyle = {
    width: "100%",
    height: "500px",
  };

  const handleClick = (index) => {
    setClickedIndex(index);
    setActiveIndex(index);
    setTimeout(() => setClickedIndex(null), 400); // reset after animation
  };

  const showRoute = (destination, index) => {
    handleClick(index);
    const service = new window.google.maps.DirectionsService();

    const destinationLatLng = {
      lat: destination.latitude,
      lng: destination.longitude,
    };
    service.route(
      {
        origin: origin,
        destination: destinationLatLng,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          console.log("Route result:", result);
          setDirections(result);
          setActiveIndex(index);
          const duration = result.routes[0].legs[0].duration.text;
          setDurations((prev) => {
            const updated = [...prev];
            updated[index] = duration;
            return updated;
          });
        } else {
          console.error("Route Failed");
        }
      }
    );
  };

  return (
    <>
      <div className="px-2 py-2 bg-gray-300 rounded-2xl">
        <div className=" px-10 py-10  rounded-2xl font-raleway bg-gray-100">
          <div className="flex flex-col  p-8 gap-2 ">
            {/* sidebar for inputs */}
            <div className="flex flex-col gap-10 w-full h-full  rounded-2xl ">
              <h1 className="text-3xl text-gray-600">{property.location}</h1>
              <div className="flex  justify-between w-full gap-20">
                {searchDestinations.map((dest, index) => (
                  <button
                    key={dest.label}
                    onClick={() => {
                      showRoute(dest, index);
                    }}
                    className={`mb-5 w-full h-20 border bg-gray-200 border-gray-400 rounded-md hover:bg-[#02343F] hover:text-gray-100 text-2xl text-gray-600 ${
                      activeIndex === index
                        ? "!bg-[#02343F] text-gray-100 "
                        : "bg-gray-200 text-[#02343F]"
                    } ${clickedIndex === index ? "animate-beat" : ""}`}
                  >
                    {activeIndex === index && durations[index]
                      ? durations[index] + " drive" // show time only if selected
                      : dest.label}{" "}
                  </button>
                ))}
              </div>
            </div>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
            >
              <Marker
                position={{ lat: property.latitude, lng: property.longitude }}
                title={property.location}
              />
              <DirectionsRenderer directions={directions} />
            </GoogleMap>
          </div>
        </div>
      </div>
    </>
  );
}

export default MapSearch;
