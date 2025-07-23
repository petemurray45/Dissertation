import PlaceTile from "./PlaceTile";
import PlacesCategorySelector from "./PlacesCategorySelector";
import { useTravelStore } from "../../utils/useTravelStore";
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
    <div className="w-full px-20 my-10 py-10">
      <h1 className="text-4xl font-raleway pb-2">Nearby Places</h1>
      <PlacesCategorySelector selectedType={category} onSelect={setCategory} />
      <div className="flex gap-20 my-10 overflow-x-auto scrollbar-hide">
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
  );
}

export default PlacesSection;
