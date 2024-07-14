import { MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { userStore } from "../store/UserStore";
import { messageStore } from "../store/MessageStore";

const Messages = () => {
  const uid = userStore((state) => state.uid);
  const messages = messageStore((state) => state.messages);

  return (
    <div className=" text-black ">
      {messages.map((message) => (
        <MessageBox
          position={message.uid === uid ? "right" : "left"}
          type={"text"}
          text={message.text}
          title={message.name}
          id={message.text}
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
    </div>
  );
};

export default Messages;
