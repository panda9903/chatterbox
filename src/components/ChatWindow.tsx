import MessageBox from "./MessageBox";
import Messages from "./Messages";

const ChatWindow = () => {
  return (
    <div className=" flex grow flex-col h-screen">
      <Messages />
      <MessageBox />
    </div>
  );
};

export default ChatWindow;
