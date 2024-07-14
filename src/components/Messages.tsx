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
          date={new Date()}
          titleColor="#000000"
          replyButton={false}
          onReplyMessageClick={() => {}}
          forwarded={false}
          removeButton={false}
          status={message.uid === uid ? "read" : "received"}
          notch={false}
          retracted={false}
        />
      ))}
      <div ref={scrollDownRef} className="mt-4"></div>
    </div>
  );
};

export default Messages;
