import MessageBox from "./MessageBox";
import Messages from "./Messages";
import { db } from "../firebase";
import {
  onDisconnect,
  ref,
  update,
  onValue,
  serverTimestamp,
  get,
} from "firebase/database";
import { userStore } from "../store/UserStore";
import { useEffect } from "react";

const ChatWindow = () => {
  const name = userStore((state) => state.name);
  const uid = userStore((state) => state.uid);
  const selectedUser = userStore((state) => state.selectedUser);
  const setSelectedUser = userStore((state) => state.setSelectedUser);

  const setUsers = userStore((state) => state.setUsers);

  const usersRef = ref(db, "users/" + uid);
  const allUsersRef = ref(db, "users");

  const changeSeenStatus = (uid: string) => {
    console.log(uid, "changeSeenStatus");

    get(ref(db, "messages/" + selectedUser.uid + "/" + uid)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log(data, "data");
          const messages = Object.keys(data).map((key) => {
            console.log(data[key].seen, "seen");
            if (data[key].seen === "sent") {
              update(
                ref(db, "messages/" + selectedUser.uid + "/" + uid + "/" + key),
                {
                  seen: "received",
                }
              );
            }
          });
        }
      }
    );
  };

  const updateStatus = ({ status }: { status: string }) => {
    update(usersRef, {
      status: status,
      name: name,
    });
  };

  if (!name || !uid) return null;

  useEffect(() => {
    onDisconnect(usersRef).set({
      status: "offline",
      name: name,
      lastActive: serverTimestamp(),
    });

    const connectedRef = ref(db, ".info/connected");
    onValue(connectedRef, (snap) => {
      console.log(snap.val(), "is data");
      if (snap.val() === true) {
        updateStatus({ status: "online" });
      } else {
        console.log("not connected");
        updateStatus({ status: "offline" });
      }
    });

    onValue(allUsersRef, (snapshot) => {
      if (snapshot.exists()) {
        //console.log(snapshot.val());
        const data = snapshot.val();

        const users = Object.keys(data).map((key) => {
          console.log(data[key].name, key, data[key].status);

          if (key === selectedUser.uid) {
            setSelectedUser({
              name: data[key].name,
              uid: key,
              status: data[key].status,
            });
          }

          if (data[key].status === "online") {
            console.log("online", data[key].name);
            changeSeenStatus(key);
          }

          return {
            name: data[key].name,
            uid: key,
            status: data[key].status,
          };
        });
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
