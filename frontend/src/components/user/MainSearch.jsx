import { MapPinPlusInside } from "lucide-react";
import UserAutocomplete from "./UserAutocomplete";
import { useState } from "react";
import { useListingStore } from "../../utils/useListingsStore";

function MainSearch() {
  const [step, setStep] = useState(1);
  const { searchFilters, setSearchFilters } = useListingStore();
  const locationEntries = [
    { key: "location1", ...searchFilters.location1 },
    { key: "location2", ...searchFilters.location2 },
    { key: "location3", ...searchFilters.location3 },
  ];
  const stepHeading = {
    1: "Help us find the right room for you by adding locations you want to be near.",
    2: "How long would you be willing to travel to each location?",
  };
  const currentHeading = stepHeading[step] || "Start your search";
  return (
    <div className="h-64  mx-10 my-5 rounded-md px-10 py-3 flex items-center gap-3  shadow-sm  bg-[#02343F]">
      <div className="w-full h-full flex flex-col justify-start items-center py-8">
        <h1 className="text-white text-4xl font-raleway text-center">
          {currentHeading}
        </h1>
        {step === 1 && (
          <div className="pt-10">
            <form className="grid sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-24">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-thin font-raleway text-white">
                    Location 1
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                    <MapPinPlusInside />
                  </div>
                  <UserAutocomplete
                    onPlaceSelect={({ location, latitude, longitude }) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        location1: {
                          ...prev.location1,
                          name: location,
                          lat: latitude,
                          lng: longitude,
                        },
                      }))
                    }
                    className="w-96 rounded-md"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-thin font-raleway text-white">
                    Location 2
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                    <MapPinPlusInside />
                  </div>
                  <UserAutocomplete
                    onPlaceSelect={({ location, latitude, longitude }) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        location2: {
                          ...prev.location2,
                          name: location,
                          lat: latitude,
                          lng: longitude,
                        },
                      }))
                    }
                    className="w-96 rounded-md"
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-thin font-raleway text-white">
                    Location 3
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                    <MapPinPlusInside />
                  </div>
                  <UserAutocomplete
                    onPlaceSelect={({ location, latitude, longitude }) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        location3: {
                          ...prev.location3,
                          name: location,
                          lat: latitude,
                          lng: longitude,
                        },
                      }))
                    }
                    className="w-96 rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-center items-center pt-10 ">
                <button
                  onClick={() => setStep(2)}
                  className="btn w-44 h-[48px] rounded-md font-raleway"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="pt-10">
            <form className="grid sm:grid-cols-1 md:grid-cols-4 lg:grid-cold-4">
              {locationEntries.map((location, index) => (
                <div key={location.key} className="form-control">
                  <label className="label text-white font-raleway">
                    Travel time to: {location.name || "Location " + (index + 1)}
                  </label>
                  <input
                    type="number"
                    value={location.maxTravelTime}
                    placeholder="e.g. 30 minutes"
                    className="input pl-10 py-1  focus:input-primary focus:border-[#02343F] transition-colors  duration-200 input-bordered"
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
              ))}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainSearch;
