import React from "react";
import { userStore } from "../store/UserStore";

const Chat = () => {
  const name = userStore((state) => state.name);
  const uid = userStore((state) => state.uid);
  console.log(uid);
  console.log(name);

  return <div>Chat</div>;
};

export default Chat;
