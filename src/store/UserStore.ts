import { create } from "zustand";

export interface User {
  name: string;
  uid: string;
  status: string;
}
interface UserStore {
  name: string;
  uid: string;
  setIds: (name: string, uid: string) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  selectedUser: User;
  setSelectedUser: (selectedUser: User) => void;
}

export const userStore = create<UserStore>()((set) => ({
  name: "",
  uid: "",
  setIds: (name: string, uid: string) => set({ name, uid }),
  users: [],
  setUsers: (users: User[]) => set({ users }),
  selectedUser: { name: "", uid: "", status: "" },
  setSelectedUser: (selectedUser: User) => set({ selectedUser }),
}));
