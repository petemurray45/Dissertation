import { Typed } from "react-typed";
import { ReactTyped } from "react-typed";
function PropPal() {
  return (
    <>
      <div
        className="relative overflow-hidden h-screen font-raleway"
        style={{
          backgroundImage: `linear-gradient(to right top, #ffffff, #d3d4d9, #a5abb5, #778491, #49606e, #435f6c, #3e5e69, #395d66, #5d7d85, #829fa6, #a9c3c8, #d1e7eb)`,
        }}
      >
        {/* Proppal hero */}
        <div className="flex justify-center items-center text-center w-full text-3xl h-[600px]">
          <span>
            <ReactTyped
              strings={[
                "Hi! I'm PropPal",
                "Consider me your personal AI estate agent.",
                "What can I help you with today?",
              ]}
              typeSpeed={50}
              className="text-gray-200"
            ></ReactTyped>
          </span>
        </div>
      </div>
    </>
  );
}

export default PropPal;
