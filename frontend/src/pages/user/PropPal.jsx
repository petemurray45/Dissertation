import { Typed } from "react-typed";
import { ReactTyped } from "react-typed";
import ChatBot from "../../components/user/chatBot/chatBot";
import NavBar from "../../components/user/design-components/NavBar";
function PropPal() {
  return (
    <>
      <div
        className="relative overflow-hidden h-screen font-raleway"
        style={{
          backgroundImage: `linear-gradient(to right top, #ffffff, #d3d4d9, #a5abb5, #778491, #49606e, #435f6c, #3e5e69, #395d66, #5d7d85, #829fa6, #a9c3c8, #d1e7eb)`,
        }}
      >
        <NavBar />
        {/* Proppal hero */}
        {/*}
        <div className="flex flex-col gap-5 justify-center text-left w-full text-3xl text-shadow-lg  h-[600px] mx-40">
          <ReactTyped
            strings={["Hi! I'm PropPal"]}
            typeSpeed={60}
            className="text-gray-200"
            showCursor={false}
          />
          <ReactTyped
            strings={["Consider me your personal AI estate agent."]}
            typeSpeed={65}
            className="text-gray-200"
            startDelay={2000}
            showCursor={false}
          />
          <ReactTyped
            strings={["What can I help you with today?"]}
            typeSpeed={65}
            className="text-gray-200"
            startDelay={6000}
            showCursor={false}
          />
          
        </div>
        */}
        <ChatBot />
      </div>
    </>
  );
}

export default PropPal;
