import { create } from "zustand";

interface Message {
  text: string;
  uid: string;
}

interface MessageStore {
  messages: Message[];
  addMessage: (message: string, uid: string) => void;
}

export const messageStore = create<MessageStore>()((set) => ({
  messages: [],
  addMessage: (message: string, uid: string) =>
    set((state) => ({
      messages: [...state.messages, { text: message, uid: uid }],
    })),
}));
