import { create } from "zustand";
import axios from "axios";
const BASE_URL = "http://localhost:3000";

export const useChatStore = create((set, get) => ({
  messages: [],
  typingMessage: "",
  loading: false,

  setTypingMessage: (text) => set({ typingMessage: text }),
  clearTypingMessage: () => set({ typingMessage: "" }),
  clearMessages: () => set({ messages: [] }),

  sendMessage: async (userMessage) => {
    const { messages } = get();
    set({ loading: true });

    try {
      set({
        messages: [...messages, { role: "user", content: userMessage }],
      });

      const response = await axios.post(`${BASE_URL}/api/chat`, {
        message: userMessage,
      });

      const fullReply = response.data.reply || "";
      const properties = response.data.properties || [];

      let index = 0;
      const typingInterval = setInterval(() => {
        index++;
        const partial = fullReply.slice(0, index);
        get().setTypingMessage(partial);

        if (index === fullReply.length) {
          clearInterval(typingInterval);
          set((state) => ({
            messages: [
              ...state.messages,
              {
                role: "assistant",
                content: fullReply,
                ...(properties.length > 0 ? { properties } : {}),
              },
            ],
            typingMessage: "",
            loading: false,
          }));
        }
      }, 20);
    } catch (err) {
      console.error("Chat error", err);
      set({ loading: false });
    }
  },

  sendIntroduction: async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/chat`, {
        message: "Say hello and introduce yourself to the user.",
      });

      const fullIntro =
        response.data.reply || "Hi, I'm PropPal. How can I assist you today?";
      let current = "";

      for (let i = 0; i < fullIntro.length; i++) {
        current += fullIntro[i];
        set({ typingMessage: current });
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      set({
        typingMessage: "",
        messages: [
          {
            role: "assistant",
            content: fullIntro,
          },
        ],
      });
    } catch (err) {
      set({
        messages: [
          {
            role: "bot",
            content:
              "Hi! Im PropPal, I am having trouble connecting right now.",
          },
        ],
      });
    }
  },
}));
