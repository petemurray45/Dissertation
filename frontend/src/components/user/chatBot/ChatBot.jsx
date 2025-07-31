import { useChatStore } from "../../../utils/useChatStore";
import { useState, useEffect } from "react";
import PropertyTile from "../PropertyTile";
import { useRef } from "react";

function ChatBot() {
  const { messages, sendMessage, loading, sendIntroduction, typingMessage } =
    useChatStore();
  const [input, setInput] = useState("");
  const endMessageRef = useRef(null);
  const hasIntroduced = useRef(false);

  useEffect(() => {
    if (!hasIntroduced.current) {
      sendIntroduction();
      hasIntroduced.current = true;
    }
  }, []);

  useEffect(() => {
    if (endMessageRef.current) {
      endMessageRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const scrollContainer = document.getElementById("chat-scroller");
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages, typingMessage]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };
  return (
    <div className="flex flex-col p-4 h-screen   font-raleway">
      <div
        className="flex-1 overflow-y-auto space-y-4 px-60 py-40 text-2xl leading-loose text-shadow-lg"
        id="chat-scroller"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            } mb-2`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-md text-gray-200 text-shadow-lg ${
                message.role === "user"
                  ? "bg-[#02343F] rounded-br-none"
                  : "bg-white/40 backdrop-blur-md rounded-bl-none"
              }`}
            >
              {message.role === "user" ? (
                <p className="text-gray-200">
                  <strong className="pr-3">You:</strong> {message.content}
                </p>
              ) : (
                <>
                  {message.content && (
                    <p className="text-gray-200">
                      <strong className="pr-3">PropPal:</strong>{" "}
                      {message.content}
                    </p>
                  )}
                  {message.properties && message.properties.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-2">
                      {message.properties.map((property) => (
                        <PropertyTile key={property.id} property={property} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            <div ref={endMessageRef} />
          </div>
        ))}

        {typingMessage && (
          <div className="flex justify-start mb-2">
            <div className="max-w-[75%] px-4 py-2 rounded-2xl shadow-md bg-white/40 backdrop-blur-md text-gray-200 rounded-bl-none">
              <p className="text-gray-200">
                <strong className="pr-3">PropPal:</strong> {typingMessage}
                <span className="animate-pulse">|</span>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 mb-20">
        <div className="flex items-center gap-4 px-60 py-10">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me something...."
            className="flex-1 items-start rounded-2xl h-24 bg-white/40 backdrop-blur-md px-4 rounded-tr-none rounded-br-none placeholder:text-gray-100 placeholder:text-2xl text-2xl overflow-hidden "
          />
          <button
            onClick={handleSend}
            className="bg-[#02343F] h-24  text-white px-4 py-2 rounded-2xl hover:bg-[#F0EDCC] hover:text-black w-44 text-4xl rounded-tl-none rounded-bl-none"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
