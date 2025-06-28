import React from "react";
import { useState } from "react";

function ProximitySearch({ onSearch }) {
  const [location, setLocation] = useState("");
  const [maxTravelTime, setMaxTravelTime] = useState(30);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = () => {
    onSearch({
      location,
      maxTravelTime,
      minPrice,
      maxPrice,
      minBedrooms,
      maxBedrooms,
    });
  };

  return (
    <div className="bg-white-300 shadow-md p-6 rounded-lg max-w-5xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Search Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Essential Location */}
        <input
          type="text"
          placeholder="Enter an essential location..."
          className="input input-bordered w-full"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* Max travel time */}
        <input
          type="number"
          placeholder="Max travel time (mins)"
          className="input input-bordered w-full"
          value={maxTravelTime}
          onChange={(e) => setMaxTravelTime(e.target.value)}
        />

        {/* Price filters */}
        <input
          type="number"
          placeholder="Min price"
          className="input input-bordered w-full"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max price"
          className="input input-bordered w-full"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <button className="btn btn-primary" onClick={handleSearch} />
      </div>
    </div>
  );
}

export default ProximitySearch;
