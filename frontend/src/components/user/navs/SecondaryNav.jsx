function SecondaryNav({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="w-full h-24 bg-[#4a6d66]  px-4">
      <div className="flex flex-wrap justify-between items-stretch h-full mx-10 text-white font-raleway text-lg sm:text-xl md:text-2xl">
        {tabs.map((tab, index) => (
          <>
            <div
              key={tab.key}
              className={`cursor-pointer flex flex-1 justify-center items-center text-3xl h-full hover:bg-white hover:text-[#02343F] px-7 ${
                activeTab === tab.key ? "bg-white text-[#02343F]" : "text-white"
              } ${index !== 0 ? "px-10 whitespace-nowrap" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </div>
            {index < tabs.length - 1 && (
              <div className="w-px h-full bg-white hidden sm:block" />
            )}
          </>
        ))}
      </div>
    </div>
  );
}

export default SecondaryNav;
