import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const renderStars = (rating) => {
  if (typeof rating !== "number" || rating < 0) {
    return <p className="text-gray-400 text-sm">No rating</p>;
  }
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1 text-yellow-500">
      {Array(full).fill(<FaStar />)}
      {half && <FaStarHalfAlt />}
      {Array(empty).fill(<FaRegStar />)}
    </div>
  );
};

function PlaceTile({ name, photoUrl, rating, vicinity, ratingsTotal }) {
  return (
    <div className="flex flex-col bg-white/90 backdrop-blur-sm shadow-xl  rounded-lg p-3 sm:p-4 w-[85vw] xs:w-[78vw] sm:w-72 md:w-80 max-w-[280px] min-w-[280px] md:max-w-[400px] min-h-[240px] text-center font-raleway">
      <img
        src={photoUrl}
        alt={name}
        className="w-full h-40 object-cover rounded-md"
      />
      <div className="flex flex-col flex-grow justify-between mt-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="text-lg text-gray-600">{vicinity}</p>

          <div className="flex justify-center items-center gap-1 text-yellow-500">
            {renderStars(rating)}
            <span className="text-md text-gray-600">({ratingsTotal})</span>
          </div>
        </div>

        <div className="mt-6">
          <button className="rounded-lg shadow-md w-full bg-[#02343F] hover:bg-[#F0EDCC] hover:text-black text-white py-3 text-lg">
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlaceTile;
