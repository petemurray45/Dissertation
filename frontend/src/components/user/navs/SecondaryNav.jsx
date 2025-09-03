import React from "react";

function SecondaryNav({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="mx-4 sm:mx-6 md:mx-20 my-6 md:my-10">
      <div
        className="
          bg-[#02343F] rounded-md
          /* small: allow horizontal scroll if needed */
          overflow-x-auto
        "
      >
        <div
          className="
            grid grid-cols-2 gap-[1px]  /* tiny separators between cells */
            md:flex md:flex-nowrap md:gap-0
            items-stretch
            text-white font-raleway
            text-base sm:text-lg md:text-xl
          "
        >
          {tabs.map((tab, index) => (
            <React.Fragment key={tab.key}>
              <button
                type="button"
                data-testid={`tab-${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  whitespace-nowrap
                  inline-flex justify-center items-center
                  px-3 sm:px-5 md:px-7 py-3 md:py-4
                  transition-colors
                  ${
                    activeTab === tab.key
                      ? "bg-white text-[#02343F]"
                      : "bg-transparent text-white hover:bg-white/10"
                  }
                  /* make each cell grow evenly on md+ */
                  md:flex-1
                `}
              >
                {tab.label}
              </button>

              {index < tabs.length - 1 && (
                <div className="hidden md:block w-px bg-white/40 self-stretch" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SecondaryNav;
