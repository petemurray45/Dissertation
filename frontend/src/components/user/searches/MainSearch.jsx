import { MapPinPlusInside, Clock } from "lucide-react";
import UserAutocomplete from "../user-actions/UserAutocomplete";
import { useState } from "react";
import { useListingStore } from "../../../utils/useListingsStore";
import { useTravelStore } from "../../../utils/useTravelStore";
import { motion, AnimatePresence } from "framer-motion";

function MainSearch() {
  const [step, setStep] = useState(1);
  const {
    setDestinations,
    getPropertiesWithTravelTime,
    setSearchedDestination,
    loading,
  } = useTravelStore();

  const { setTravelSearchSubmitted } = useListingStore();

  const modes = ["DRIVING", "BICYCLING", "WALKING"];

  const handleSearch = async () => {
    const results = await getPropertiesWithTravelTime(modes);
    useListingStore.getState().setProperties(results);
    useListingStore.getState().applyFilters();
    setTravelSearchSubmitted(true);

    setSearchedDestination(true);

    console.log("Properties with Travel Time", results);
  };

  const stepHeading = {
    1: "Help us find the right room for you by adding locations you want to be near.",
    2: "How long would you be willing to travel to each location?",
  };
  const currentHeading = stepHeading[step] || "Start your search";
  return (
    <section className="w-full px-5 pt-5 lg:px-8 sm:px-10">
      <div
        className="
        w-full px-5  mx-auto bg-[#02343F] shadow-2xl rounded-md  sm:px-6 py-5 sm:py-6 md:py-8"
      >
        <h1
          className="text-white font-raleway text-center
                       text-base sm:text-2xl md:text-2xl"
        >
          {currentHeading}
        </h1>
        <div className="sm:pt-5 md:pt-3 w-full ">
          <form className="mt-4 sm:mt-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-3 md:gap-8">
            <div className="form-control w-full">
              <label className="label">
                <span
                  className="text-gray-200 font-raleway
                               text-sm sm:text-xl md:text-lg"
                >
                  Location 1
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/70">
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
                  className="w-full rounded-md
                  h-11 sm:h-12 md:h-14
                  pl-10"
                  placeholder="e.g. Workplace"
                />
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span
                  className="text-gray-200 font-raleway
                               text-sm sm:text-xl md:text-lg"
                >
                  Location 2
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/70">
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
                  className="w-full rounded-md h-11 sm:h-12 md:h-14 pl-10"
                  placeholder="e.g. School"
                />
              </div>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span
                  className="text-gray-200 font-raleway
                               text-sm sm:text-xl md:text-lg"
                >
                  Location 3
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/70">
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
                  className="w-full rounded-md h-11 sm:h-12 md:h-14 pl-10"
                  placeholder="e.g. Gym"
                />
              </div>
            </div>
            <div className="col-span-full">
              {!loading ? (
                <button
                  type="button"
                  className="block w-full h-12 md:h-14 rounded-md font-raleway
                          text-lg md:text-xl bg-white text-[#02343F] hover:bg-[#F0EDCC]
                          px-6 md:px-8 mt-2 md:mt-0 sm:mt-6"
                  onClick={handleSearch}
                >
                  Next
                </button>
              ) : (
                <div className="flex justify-center items-center pt-4 h-14">
                  <span className="loading loading-spinner text-white" />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default MainSearch;
