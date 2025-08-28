function Description({ property }) {
  return (
    <>
      <div className="w-full rounded-xl bg-gray-300 px-3 xs:px-4 sm:px-5 md:px-6 py-2">
        <div>
          <div className="flex items-center py-1 sm:py-2">
            <h1
              className="font-raleway text-2xl xs:text-3xl sm:text-4xl md:text-5xl
            text-gray-700 font-semibold tracking-tight
            break-words hyphens-auto"
            >
              About {property.location}
            </h1>
          </div>
          <div
            className="bg-gray-100 backdrop-blur-sm rounded-xl shadow
          px-4 sm:px-6 py-4
          text-base xs:text-lg md:text-xl
          leading-relaxed md:leading-loose
          text-gray-800 font-raleway
          whitespace-pre-line break-words hyphens-auto"
            data-testid="property-description"
          >
            {property.description}
          </div>
        </div>
      </div>
    </>
  );
}

export default Description;
