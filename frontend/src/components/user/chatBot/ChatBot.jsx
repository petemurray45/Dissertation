import { useChatStore } from "../../../utils/useChatStore";
import { useState, useEffect, useRef } from "react";
import PropertyTile from "../design-components/PropertyTile";

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
  }, [sendIntroduction]);

  useEffect(() => {
    endMessageRef.current?.scrollIntoView({ behavior: "smooth" }); // <-- fix
  }, [messages]);

  useEffect(() => {
    const el = document.getElementById("chat-scroller");
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typingMessage]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex h-screen flex-col font-raleway mt-20">
      {/* scrollable messages area */}
      <div
        id="chat-scroller"
        className="
          flex-1 overflow-y-auto
          px-4 sm:px-6 lg:px-8
          py-4 sm:py-8 pb-32 md:pb-56
        "
      >
        <div className="mx-auto w-full max-w-5xl space-y-3 sm:space-y-4 mt-20 mb-20">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
                  rounded-2xl shadow-md
                  px-3 py-2 sm:px-4 sm:py-3
                  text-sm sm:text-base md:text-xl
                  max-w-[85%] sm:max-w-[75%] lg:max-w-[70%]
                  ${
                    m.role === "user"
                      ? "bg-[#02343F] text-gray-100 rounded-br-none"
                      : "bg-white/40 backdrop-blur-md text-gray-900 rounded-bl-none"
                  }
                `}
              >
                {m.role === "user" ? (
                  <p>
                    <strong className="pr-2 sm:pr-3">You:</strong>
                    {m.content}
                  </p>
                ) : (
                  <>
                    {m.content && (
                      <p className="text-gray-200">
                        <strong className="pr-2 sm:pr-3">PropPal:</strong>
                        {m.content}
                      </p>
                    )}

                    {Array.isArray(m.properties) && m.properties.length > 0 && (
                      <div className="mt-3 grid grid-cols-1 gap-3 sm:gap-4">
                        {m.properties.map((p) => (
                          <PropertyTile key={p.id} property={p} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          {typingMessage && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-none bg-white/40 backdrop-blur-md shadow-md px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-200">
                <strong className="pr-2 sm:pr-3">PropPal:</strong>
                {typingMessage}
                <span className="animate-pulse">|</span>
              </div>
            </div>
          )}

          <div ref={endMessageRef} />
        </div>
      </div>

      {/* input bar */}
      <div className="fixed bottom-12 left-0 right-0 bg-transparent">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me something…"
            className="
              flex-1 rounded-2xl rounded-tr-none rounded-br-none
              bg-white/20 backdrop-blur-md
              h-11 sm:h-12 lg:h-14
              px-3 sm:px-4
              text-base sm:text-lg
              placeholder:text-gray-500
              focus:outline-none
            "
            aria-label="Chat message"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="
              rounded-2xl rounded-tl-none rounded-bl-none
              bg-[#02343F] text-white
              h-11 sm:h-12 lg:h-14
              px-4 sm:px-6
              text-base sm:text-lg lg:text-xl
              hover:bg-[#F0EDCC] hover:text-black
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
