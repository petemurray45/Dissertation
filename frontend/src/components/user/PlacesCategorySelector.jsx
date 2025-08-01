function PlacesCategorySelector({ selectedType, onSelect }) {
  const categories = [
    { label: "Tourist Attractions", value: "tourist_attraction" },
    { label: "Food & Drink", value: "restaurant" },
    { label: "Shops", value: "shopping_mall" },
    { label: "Parks", value: "park" },
    { label: "Museums", value: "museum" },
  ];

  return (
    <div className="flex flex-wrap  my-4 justify-between font-raleway">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onSelect(category.value)}
          className={`px-4 py-2 rounded-md border w-72 h-16 text-2xl ${
            selectedType === category.value
              ? "bg-[#02343F] text-white"
              : "bg-white/90 backdrop-blur-sm text-gray-600 border-gray-100"
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}

export default PlacesCategorySelector;
