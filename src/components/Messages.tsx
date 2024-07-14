import { useEffect, useState } from "react";
import { MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { get, onValue, push, ref, set } from "firebase/database";
import { db } from "../firebase";
import { userStore } from "../store/UserStore";

type Message = {
  name: string;
  text: string;
};

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const name = userStore((state) => state.name);

  useEffect(() => {
    const messagesRef = ref(db, "messages/" + name + "/" + "Chans");
    onValue(messagesRef, (snapshot) => {
      setMessages([]);
      const data = snapshot.val();
      console.log(data);
      console.log("-------------------");

      const newMessages = Object.keys(data).map((key) => ({
        name: data[key].name,
        text: data[key].text,
      }));

      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
    });
  }, []);

  return (
    <div className=" text-black">
      {messages.map((message) => (
        <MessageBox
          position={message.name === name ? "right" : "left"}
          type={"text"}
          text={message.text}
          title={message.name}
        />
      ))}
    </div>
  );
};

export default Messages;
