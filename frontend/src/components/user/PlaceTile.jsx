function PlaceTile({ name, photoUrl, rating, vicinity, types }) {
  return (
    <div className="w-64 bg-white shadow-lg rounded-lg p-4 text-center font-raleway">
      <img
        src={photoUrl}
        alt={name}
        className="w-full h-40 object-cover rounded-md"
      />
      <h3 className="text-lg font-bold mt-2">{name}</h3>
      <p className="text-md text-gray-500">{vicinity}</p>
      <p className="text-md text-yellow-500 mt-1">{rating}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-1 text-xs text-gray-600">
        {types.map((type, index) => (
          <span key={index} className="bg-gray-200 rounded px-2 py-1">
            {type.replace("_", " ")}
          </span>
        ))}
      </div>
    </div>
  );
}

export default PlaceTile;
