function Description({ property }) {
  return (
    <>
      <div className=" w-full  rounded-lg">
        <div>
          <h1 className="text-4xl text-gray-300 font-raleway">
            About {property.location}
          </h1>
          <div className="text-2xl font-raleway text-gray-100 mt-10 leading-loose">
            {property.description}
          </div>
        </div>
      </div>
    </>
  );
}

export default Description;
