import { create } from "zustand";

interface UserStore {
  name: string;
  uid: string;
  setIds: (name: string, uid: string) => void;
}

export const userStore = create<UserStore>()((set) => ({
  name: "",
  uid: "",
  setIds: (name: string, uid: string) => set({ name, uid }),
}));
