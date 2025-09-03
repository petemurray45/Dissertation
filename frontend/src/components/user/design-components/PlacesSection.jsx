import PlaceTile from "./PlaceTile";
import PlacesCategorySelector from "../user-actions/PlacesCategorySelector";
import { useTravelStore } from "../../../utils/useTravelStore";
import { useEffect, useState } from "react";

function PlacesSection({ lat, lng }) {
  const [category, setCategory] = useState("tourist_attraction");
  const { fetchNearbyPlaces, nearbyPlaces, placesLoading, placesError } =
    useTravelStore();

  useEffect(() => {
    if (lat && lng) {
      fetchNearbyPlaces({
        lat: lat,
        lng: lng,
        type: category,
      });
    }
  }, [lat, lng, category]);

  if (placesLoading) {
    return (
      <div className="flex w-full h-[800px] justify-center items-center">
        <div className="loading loading-spinner text-4xl" />
      </div>
    );
  }

  if (placesError) {
    return <div className="text-center p-6">{placesError}</div>;
  }

  if (!nearbyPlaces || nearbyPlaces.length === 0) {
    return (
      <div className="text-center p-6 text-gray-600">
        No nearby places found.
      </div>
    );
  }

  return (
    <div className="px-2 py-2 bg-gray-300 rounded-2xl overflow-x-hidden">
      <div className="w-full px-8 md:px-20 py-10 bg-gray-200 rounded-2xl overflow-x-hidden">
        <h1 className="text-2xl md:text-4xl font-raleway pb-2">
          Nearby Places
        </h1>
        <PlacesCategorySelector
          selectedType={category}
          onSelect={setCategory}
        />
        {/* mobile vertical stack */}
        <div className="md:hidden flex flex-col gap-4  overflow-y-auto px-10">
          {nearbyPlaces
            .filter(
              (place) =>
                place?.photoUrl?.length > 0 &&
                typeof place.rating === "number" &&
                !isNaN(place.rating)
            )
            .map((place, index) => (
              <PlaceTile
                key={index}
                name={place.name}
                photoUrl={place.photoUrl}
                rating={place.rating}
                vicinity={place.vicinity}
                ratingsTotal={place.user_ratings_total}
              />
            ))}
        </div>
        <div className="hidden md:grid md:grid-flow-col md:auto-cols-[300px] md:gap-12 md:overflow-x-auto md:pb-2 scrollbar-hide">
          {nearbyPlaces
            .filter(
              (place) =>
                place?.photoUrl?.length > 0 &&
                typeof place.rating === "number" &&
                !isNaN(place.rating)
            )
            .map((place, index) => (
              <PlaceTile
                key={index}
                name={place.name}
                photoUrl={place.photoUrl}
                rating={place.rating}
                vicinity={place.vicinity}
                ratingsTotal={place.user_ratings_total}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default PlacesSection;
