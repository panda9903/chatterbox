import { create } from "zustand";

interface Message {
  text: string;
  uid: string;
  name: string;
}

interface MessageStore {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

export const messageStore = create<MessageStore>()((set) => ({
  messages: [],
  setMessages: (messages: Message[]) => set({ messages }),
}));
