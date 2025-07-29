function Description({ property }) {
  return (
    <>
      <div className=" w-full  rounded-lg">
        <div>
          <h1 className="text-4xl text-white font-raleway">
            About {property.location}
          </h1>
          <div className="text-2xl bg-white/60 backdrop-blur-sm font-raleway text-gray-800 rounded-xl px-6 py-4 mt-10 leading-loose">
            {property.description}
          </div>
        </div>
      </div>
    </>
  );
}

export default Description;
