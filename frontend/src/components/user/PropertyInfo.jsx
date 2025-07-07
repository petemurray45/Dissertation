import react from "react";

function PropertyInfo({ property }) {
  return (
    <div className=" bg-white h-[800px] w-full  border-4 border-gray-200 rounded-2xl min-w-[400px] font-raleway">
      <div>
        <h1 className="text-4xl text-black p-6 border-b-2">Property Info</h1>
        <div className="grid grid-cols-2 gap-10 h-full w-[100%] p-6">
          <p className="text-3xl">Price:</p>
          <p className="text-3xl">£{property.price_per_month}</p>
          <p className="text-3xl">Property Type:</p>
          <p className="text-3xl">{/*Need to implement property type*/}</p>
          <p className="text-3xl">En suite:</p>
          <p>{/*Need to implement en suite option*/}</p>
        </div>
      </div>
    </div>
  );
}

export default PropertyInfo;
