import MessageBox from "./MessageBox";
import Messages from "./Messages";
import { db } from "../firebase";
import { onDisconnect, ref, update, onValue } from "firebase/database";
import { userStore } from "../store/UserStore";
import { useEffect } from "react";

const ChatWindow = () => {
  const name = userStore((state) => state.name);
  const uid = userStore((state) => state.uid);

  const setUsers = userStore((state) => state.setUsers);

  const usersRef = ref(db, "users/" + uid);
  const allUsersRef = ref(db, "users");

  const updateStatus = ({ status }: { status: string }) => {
    update(usersRef, {
      status: status,
      name: name,
    });
  };

  if (!name || !uid) return null;

  useEffect(() => {
    updateStatus({ status: "online" });
    onDisconnect(usersRef).set({ status: "offline", name: name });

    const connectedRef = ref(db, ".info/connected");
    onValue(connectedRef, (snap) => {
      console.log(snap.val(), "is data");
      if (snap.val() === true) {
        console.log("connected");
      } else {
        console.log("not connected");
      }
    });

    onValue(allUsersRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        const data = snapshot.val();

        const users = Object.keys(data).map((key) => ({
          name: data[key].name,
          uid: key,
          status: data[key].status,
        }));
        console.log(users);
        setUsers(users);
      }
    });
  }, []);

  return (
    <div className=" flex grow flex-col h-screen">
      <Messages />
      <MessageBox />
    </div>
  );
};

export default ChatWindow;
