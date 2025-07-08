import map from "../../assets/map.png";
import journey from "../../assets/journey.png";
import weather from "../../assets/weather.png";
function DashboardInfo() {
  return (
    <div className="flex flex-col h-[500px]  mx-36 font-raleway justify-center items-center mt-10 mb-10">
      <h1 className="text-5xl text-center font-extralight">Why choose us?</h1>
      <p className="text-2xl text-center mt-4">
        We at PropertyApp provide a user-centered service - finding you the best
        property that suits your needs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 justify-center items-center mt-20">
        <div className="flex w-[500px] h-[400px] items-center">
          <img src={map} className="" />
        </div>
        <div className="flex w-[500px] h-[400px] items-center">
          <img src={journey} className="" />
        </div>
        <div className="flex w-[500px] h-[400px] items-center">
          <img src={weather} className="mt-10" />
        </div>
      </div>
    </div>
  );
}

export default DashboardInfo;
