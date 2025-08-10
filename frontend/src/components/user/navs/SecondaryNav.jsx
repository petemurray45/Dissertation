function SecondaryNav({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="mx-20 my-20 h-24 bg-[#02343F] rounded-md">
      <div className="flex flex-wrap justify-between items-stretch h-full  text-white font-raleway text-lg sm:text-xl md:text-2xl">
        {tabs.map((tab, index) => (
          <>
            <div
              key={tab.key}
              className={`cursor-pointer flex flex-1 justify-center items-center text-3xl h-full hover:bg-white hover:rounded-md hover:text-[#02343F] px-7 ${
                activeTab === tab.key
                  ? "bg-white text-[#02343F] rounded-md"
                  : "text-white"
              } ${index !== 0 ? "px-10 whitespace-nowrap" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </div>
            {index < tabs.length - 1 && (
              <div className="w-px  bg-white my-2 hidden sm:block" />
            )}
          </>
        ))}
      </div>
    </div>
  );
}

export default SecondaryNav;
