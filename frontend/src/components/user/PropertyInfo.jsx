import react from "react";

function PropertyInfo({ property }) {
  const addressSplit = property.location.split(",");
  return (
    <div className=" bg-white h-[800px]  rounded-2xl min-w-[300px] font-raleway">
      <div>
        <div className="grid grid-cols-1 md:flex-row">
          <div>
            <h1 className="text-5xl text-black py-3 font-semibold">
              {addressSplit[0]},
            </h1>
            <h1 className="text-4xl text-black py-3 font-thin ">
              {addressSplit[1]}
            </h1>
          </div>
          <div>
            <h1 className="text-5xl text-black py-3  font-semibold">
              £{property.price_per_month}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-2 shadow-2xl border-gray-300 bg-gray-200 rounded-lg gap-10 h-full w-[100%] p-6 mt-6">
          <p className="text-2xl">Price:</p>
          <p className="text-2xl text-end">£{property.price_per_month}</p>
          <p className="text-2xl">Property Type:</p>
          <p className="text-2xl text-end">
            {/*Need to implement property type*/}Bungalow
          </p>
          <p className="text-2xl">En suite:</p>
          <p className="text-2xl text-end">
            {/*Need to implement en suite option*/}Yes
          </p>
          <p className="text-2xl">Bed Type:</p>
          <p className="text-2xl text-end">{property.bedType}</p>
          <p className="text-2xl">Pet Friendly</p>
          <p className="text-2xl text-end">{/*Need to implement*/}Yes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 w-full shadow-2xl border-gray-300 bg-gray-200 rounded-lg mt-20">
          <div className="col-span-2 px-10 py-10">
            <h1 className="text-2xl">Want to save this for later?</h1>
          </div>
          <div className="flex h-full justify-center items-center ">
            <button className="btn rounded-md h-14 w-38 text-xl bg-[#02343F] hover:bg-[#F0EDCC] hover:text-black shadow-md text-white ">
              Log in now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyInfo;
