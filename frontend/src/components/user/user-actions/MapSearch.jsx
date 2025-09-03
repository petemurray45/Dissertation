import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useTravelStore } from "../../../utils/useTravelStore";
import { useState, useEffect } from "react";
import { FaCarAlt } from "react-icons/fa";
import { BsPersonWalking } from "react-icons/bs";
import { IoBicycleOutline } from "react-icons/io5";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];

const MODES = [
  { key: "DRIVING", label: "Drive", Icon: FaCarAlt },
  { key: "BICYCLING", label: "Cycle", Icon: IoBicycleOutline },
  { key: "WALKING", label: "Walk", Icon: BsPersonWalking },
];

function MapSearch({ property }) {
  const { searchDestinations } = useTravelStore();
  const [mode, setMode] = useState("DRIVING");
  const [activeIndex, setActiveIndex] = useState(null);
  const [durations, setDurations] = useState({});
  const [directions, setDirections] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    // if user switches mode while a destination is selected, redraw the route
    if (
      isLoaded &&
      activeIndex != null &&
      searchDestinations[activeIndex] != null
    ) {
      showRoute(searchDestinations[activeIndex], activeIndex, {
        keepBeat: true,
      });
    }
  }, [mode]);

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
    setTimeout(() => setClickedIndex(null), 400);
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
        travelMode: window.google.maps.TravelMode[mode],
      },
      (result, status) => {
        if (status === "OK") {
          console.log("Route result:", result);
          setDirections(result);
          setActiveIndex(index);
          const duration = result.routes[0].legs[0].duration.text;
          setDurations((prev) => ({
            ...prev,
            [mode]: {
              ...(prev[mode] || {}),
              [index]: duration,
            },
          }));
        } else {
          console.error("Route Failed");
        }
      }
    );
  };

  return (
    <>
      <div className="px-2 py-2 bg-gray-300 rounded-2xl">
        <div className=" px-5 py-5  rounded-2xl font-raleway bg-gray-100">
          <div className="flex flex-col  p-8 gap-2 ">
            <div className="flex flex-col gap-10 w-full h-full  rounded-2xl ">
              <h1 className="text-xl sm:text-2xl md:text-3xl text-gray-600">
                {property.location}
              </h1>

              <h3 className="flex w-full h-auto items-center justify-center font-raleway text-xl md:text-2xl">
                Select a travel method
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {MODES.map(({ key, label, Icon }) => {
                  const active = mode === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setMode(key)}
                      className={`mb-5 w-full h-20 border border-gray-400 rounded-md hover:bg-[#02343F] hover:text-gray-100 text-2xl  p-2 flex items-center justify-center gap-3
                      ${
                        active
                          ? "bg-[#02343F] text-white"
                          : "bg-white text-[#02343F]"
                      }
                      border border-gray-300 first:rounded-l-md last:rounded-r-md -ml-[1px]`}
                      aria-pressed={active}
                    >
                      <Icon />
                      {label}
                    </button>
                  );
                })}
              </div>
              <h3 className="flex w-full h-auto items-center justify-center font-raleway text-xl md:text-2xl">
                Select one of your locations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {searchDestinations.map((dest, index) => (
                  <button
                    key={dest.label}
                    onClick={() => {
                      showRoute(dest, index);
                    }}
                    className={`mb-5 w-full h-20 border  border-gray-400 rounded-md hover:bg-[#02343F] hover:text-gray-100 text-2xl p-2 ${
                      activeIndex === index
                        ? "!bg-[#02343F] text-gray-100 "
                        : "bg-gray-100 text-[#02343F]"
                    } ${clickedIndex === index ? "animate-beat" : ""}`}
                  >
                    {activeIndex === index && durations[mode]?.[index]
                      ? `${durations[mode][index]} ${mode.toLowerCase()}`
                      : dest.label}
                  </button>
                ))}
              </div>
            </div>
            <GoogleMap
              mapContainerClassName="w-full h-[45vh] sm:h-[50vh] md:h-[60vh] rounded-xl overflow-hidden "
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
