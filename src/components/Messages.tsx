import { MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { userStore } from "../store/UserStore";
import { messageStore } from "../store/MessageStore";
import { useEffect, useRef } from "react";

const Messages = () => {
  const uid = userStore((state) => state.uid);
  const messages = messageStore((state) => state.messages);

  const scrollDownRef = useRef(null);

  useEffect(() => {
    scrollDownRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className=" text-black flex flex-col grow mb-8">
      {messages.map((message) => (
        <MessageBox
          position={message.uid === uid ? "right" : "left"}
          type={"text"}
          text={message.text}
          title={message.name}
          id={Math.random() * 1000000}
          focus={false}
          date={new Date(message.timestamp)}
          titleColor={message.uid === uid ? "#128C7E" : "#000"}
          replyButton={false}
          onReplyMessageClick={() => {}}
          forwarded={false}
          removeButton={false}
          status={message.uid !== uid ? "read" : message.seen}
          notch={false}
          retracted={false}
        />
      ))}
      <div
        ref={scrollDownRef}
        className="mt-4 absolute bottom-0 h-4 w-[calc(100%-300px)] bg-white z-50"
      ></div>
    </div>
  );
};

export default Messages;
