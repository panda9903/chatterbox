import MessageBox from "./MessageBox";
import Messages from "./Messages";
import { auth, db } from "../firebase";

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
import { signOut } from "firebase/auth";

const ChatWindow = () => {
  const name = userStore((state) => state.name);
  const uid = userStore((state) => state.uid);
  const selectedUser = userStore((state) => state.selectedUser);
  const setSelectedUser = userStore((state) => state.setSelectedUser);

  const setUsers = userStore((state) => state.setUsers);

  const usersRef = ref(db, "users/" + uid);
  const allUsersRef = ref(db, "users");

  const changeSeenStatus = (uid: string) => {
    get(ref(db, "messages/" + selectedUser.uid + "/" + uid)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          for (const [senderId, senderMessages] of Object.entries(data)) {
            for (const [messageId, message] of Object.entries(senderMessages)) {
              if (message.seen === "sent") {
                update(
                  ref(
                    db,
                    "messages/" +
                      selectedUser.uid +
                      "/" +
                      uid +
                      "/" +
                      senderId +
                      "/" +
                      messageId
                  ),
                  {
                    seen: "received",
                  }
                );
              }
            }
          }
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
    const connectedRef = ref(db, ".info/connected");
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        updateStatus({ status: "online" });
      } else {
        updateStatus({ status: "offline" });
      }
    });

    onValue(allUsersRef, (snapshot) => {
      //console.log("Someone changed");
      if (snapshot.exists()) {
        const data = snapshot.val();
        const users = Object.keys(data).map((key) => {
          if (key === selectedUser.uid) {
            setSelectedUser({
              name: data[key].name,
              uid: key,
              status: data[key].status,
            });
          }

          if (data[key].status === "online") {
            changeSeenStatus(key);
          }
          //console.log(data[key].status, key, data[key].name);
          return {
            name: data[key].name,
            uid: key,
            status: data[key].status,
          };
        });
        setUsers(users);
      }
    });

    onDisconnect(usersRef)
      .set({
        status: "offline",
        name: name,
        lastActive: serverTimestamp(),
      })
      .then(() => {
        signOut(auth);
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
