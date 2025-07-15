import react from "react";
import mapsImage from "../../assets/routeIcon.png";

function Info1() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 w-full h-[40%]">
      <div></div>
      <div>
        <img src={mapsImage}></img>
      </div>
    </div>
  );
}

export default Info1;
