function Description({ property }) {
  return (
    <>
      <div className=" w-full  rounded-lg bg-gray-300 px-2 py-2">
        <div>
          <div className="flex items-center py-2 px-2">
            <h1 className="text-4xl text-gray-600 font-raleway">
              About {property.location}
            </h1>
          </div>
          <div className="text-2xl bg-gray-100 backdrop-blur-sm font-raleway text-gray-800 rounded-xl px-6 py-4 mt-5 leading-loose whitespace-pre-line">
            {property.description}
          </div>
        </div>
      </div>
    </>
  );
}

export default Description;
