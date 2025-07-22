import PlaceTile from "./PlaceTile";
import { useTravelStore } from "../../utils/useTravelStore";

function PlacesSection() {
  const { nearbyPlaces, placesLoading, placesError } = useTravelStore();

  if (placesLoading) {
    return <div className="text-center p-6">Loading nearby places...</div>;
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
    <div className="w-full px-20 border-2 h-[600px] mt-10">
      <h1 className="text-4xl font-raleway">Nearby Places</h1>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {nearbyPlaces.map((place, index) => (
          <PlaceTile
            key={index}
            name={place.name}
            photoUrl={place.photoUrl}
            rating={place.rating}
            vicinity={place.vicinity}
            types={place.types}
          />
        ))}
      </div>
    </div>
  );
}

export default PlacesSection;
