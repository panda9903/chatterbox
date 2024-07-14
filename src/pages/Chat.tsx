import { useEffect } from "react";
import { userStore } from "../store/UserStore";
import { useNavigate } from "react-router-dom";
import UsersList from "../components/UsersList";
import ChatWindow from "../components/ChatWindow";

const Chat = () => {
  const name = userStore((state) => state.name);
  const uid = userStore((state) => state.uid);

  const navigate = useNavigate();

  useEffect(() => {
    if (!name || !uid) {
      console.log("Redirecting to login");
      alert("You need to login first");
      navigate("/login");
    }
  }, []);

  return (
    <div className="  flex flex-row gap-8">
      <UsersList />
      <ChatWindow />
    </div>
  );
};

export default Chat;
