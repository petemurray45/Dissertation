import { MapPinPlusInside, Clock } from "lucide-react";
import UserAutocomplete from "./UserAutocomplete";
import { useState } from "react";
import { useListingStore } from "../../utils/useListingsStore";
import { useTravelStore } from "../../utils/useTravelStore";
import { motion, AnimatePresence } from "framer-motion";
import TransportSelector from "./TransportSelector";

function MainSearch() {
  const [step, setStep] = useState(1);
  const {
    setDestinations,
    getPropertiesWithTravelTime,
    setSearchedDestination,
  } = useTravelStore();

  const modes = ["DRIVING"];

  const handleSearch = async () => {
    const results = await getPropertiesWithTravelTime(modes);
    setSearchedDestination(true);

    console.log("Properties with Travel Time", results);
  };

  const stepHeading = {
    1: "Help us find the right room for you by adding locations you want to be near.",
    2: "How long would you be willing to travel to each location?",
  };
  const currentHeading = stepHeading[step] || "Start your search";
  return (
    <div className="sm:h-80 md:h-64 w-full my-5 rounded-md px-10 py-3 flex items-center gap-3  shadow-sm  bg-[#02343F]">
      <div className=" flex flex-col justify-start items-center py-8 w-full">
        <h1 className="text-white sm:text-xl md:text-4xl font-raleway text-center">
          {currentHeading}
        </h1>
        <div className="sm:pt-5 md:pt-10 w-full ">
          <form className="sm:grid-cols-1 md:flex lg:flex justify-between w-full items-center gap-10">
            <div className="form-control w-full">
              <label className="label">
                <span className="sm:text-xl md:text-3xl font-thin font-raleway text-gray-200">
                  Location 1
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <MapPinPlusInside />
                </div>
                <UserAutocomplete
                  onPlaceSelect={({ location, latitude, longitude }) =>
                    setDestinations({
                      label: location,
                      latitude,
                      longitude,
                    })
                  }
                  className="sm:h-4 md:h-16 w-full rounded-md"
                  placeholder="e.g. Workplace"
                />
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="sm:text-xl md:text-3xl font-thin font-raleway text-gray-200">
                  Location 2
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <MapPinPlusInside />
                </div>
                <UserAutocomplete
                  onPlaceSelect={({ location, latitude, longitude }) =>
                    setDestinations({
                      label: location,
                      latitude,
                      longitude,
                    })
                  }
                  className="w-full sm:h-4 md:h-16 rounded-md"
                  placeholder="e.g. School"
                />
              </div>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="sm:text-xl md:text-3xl font-thin font-raleway text-gray-200">
                  Location 3
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <MapPinPlusInside />
                </div>
                <UserAutocomplete
                  onPlaceSelect={({ location, latitude, longitude }) =>
                    setDestinations({
                      label: location,
                      latitude,
                      longitude,
                    })
                  }
                  className="w-full sm:h-4 md:h-16 rounded-md"
                  placeholder="e.g. Gym"
                />
              </div>
            </div>
            <div className="flex justify-center items-center  pt-10 w-full ">
              <button
                type="button"
                className="bg-white w-full sm:h-16 md:h-16 rounded-md font-raleway mt-3 sm:text-2xl md:text-3xl text-[#02343F] hover:bg-[#F0EDCC]"
                onClick={handleSearch}
              >
                Next
              </button>
            </div>
          </form>
        </div>
        {/*}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              
            </motion.div>
          )}
            */}
        {/*}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="pt-10">
                <form className="w-full grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cold-3 gap-16">
                  {locationEntries.map((location, index) => (
                    <div key={location.key} className="form-control">
                      <label className="label flex justify-center text-gray-600 font-raleway bg-gray-100 rounded-lg mb-5 ">
                        {" "}
                        {location.name || "Location " + (index + 1)}
                      </label>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                          <Clock />
                        </div>
                        <div className="flex justify-center">
                          <input
                            type="number"
                            value={location.maxTravelTime}
                            placeholder="e.g. 30 minutes"
                            className="input w-96 h-16 rounded-md pl-10 py-1  focus:input-primary focus:border-[#02343F] transition-colors  duration-200 input-bordered placeholder:pl-3"
                            onChange={(e) =>
                              setSearchFilters({
                                [location.key]: {
                                  ...searchFilters[location.key],
                                  maxTravelTime: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </form>
              </div>
            </motion.div>
          )}
            
        </AnimatePresence>
        */}
      </div>
    </div>
  );
}

export default MainSearch;
