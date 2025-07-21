import house from "../../../assets/house.png";
import search from "../../../assets/searchheart.png";
import notes from "../../../assets/notes.png";

function Overview() {
  return (
    <>
      <div className="bg-gray-200 rounded-xl min-h-[600px] mx-20 my-20 border-2 border-gray-300 shadow-lg">
        <div>
          <h1 className="text-5xl font-medium font-raleway text-[#02343F] text-center mt-10">
            Account Overview
          </h1>
        </div>
        <div className=" h-80  my-10 mx-10 border-2 flex flex-row justify-between">
          <div className="px-10">
            <img src={house} className="h-80" />
            <div>
              <p className="text-3xl text-center font-raleway text-gray-500">
                You have saved
              </p>
              <p className="text-3xl text-center font-raleway text-gray-500 pt-5">
                0 PROPERTIES
              </p>
            </div>
          </div>
          <div className="h-48px-10">
            <img src={search} className="h-80 " />
            <div>
              <p className="text-3xl text-center font-raleway text-gray-500">
                You have saved
              </p>
              <p className="text-3xl text-center font-raleway text-gray-500 pt-5">
                0 SEARCHES
              </p>
            </div>
          </div>
          <div className="h-48 px-10">
            <img src={notes} className="h-80" />
            <div>
              <p className="text-3xl text-center font-raleway text-gray-500">
                You have made
              </p>
              <p className="text-3xl text-center font-raleway text-gray-500 pt-5">
                0 NOTES
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 rounded-xl min-h-[400px] mx-20 my-20 border-2 border-gray-300 shadow-lg"></div>
    </>
  );
}

export default Overview;
