import { userStore } from "../store/UserStore";
import { db } from "../firebase";
import { get, ref, update } from "firebase/database";
import { messageStore } from "../store/MessageStore";
import { useEffect } from "react";

const UsersList = () => {
  const users = userStore((state) => state.users);
  const userId = userStore((state) => state.uid);
  const setMessages = messageStore((state) => state.setMessages);
  const setSelectedUser = userStore((state) => state.setSelectedUser);
  const selectedUser = userStore((state) => state.selectedUser);
  const messages = messageStore((state) => state.messages);

  const changeStatusToRead = () => {
    console.log(selectedUser.uid, "changeSeenStatus");
    get(ref(db, "messages/" + selectedUser.uid + "/" + userId)).then(
      (snapshot) => {
        //console.log(snapshot.exists(), "snapshot");
        if (snapshot.exists()) {
          const data = snapshot.val();
          //console.log(data, "data");
          Object.keys(data).map((key) => {
            //console.log(data[key].seen, "seen");
            if (data[key].seen === "received") {
              update(
                ref(
                  db,
                  "messages/" + selectedUser.uid + "/" + userId + "/" + key
                ),
                {
                  seen: "read",
                }
              );
            }
          });
        }
      }
    );
  };

  useEffect(() => {
    changeStatusToRead();
  }, [selectedUser, messages]);

  const getChats = (uid: string, name: string, status: string) => {
    try {
      setSelectedUser({ name, uid, status });
      changeStatusToRead();
      const chatRefs = ref(db, "messages/" + userId + "/" + uid);
      get(chatRefs).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const messages = Object.keys(data).map((key) => {
            /*  console.log(
              data[key].text,
              data[key].uid,
              data[key].name,
              data[key].seen,
              data[key].timestamp
            ); */
            return {
              text: data[key].text,
              uid: data[key].uid,
              name: data[key].name,
              seen: data[key].seen,
              timestamp: data[key].timestamp,
            };
          });
          setMessages(messages);
          console.log("messages", messages);
        } else {
          console.log("No data available");
          setMessages([]);
        }
      });
    } catch (error) {
      console.log("Error in getChats");
    }
  };

  return (
    <div>
      <ul className=" flex flex-col pt-4 gap-3 max-w-60">
        {users.map((user) => {
          if (user.uid !== userId) {
            return (
              <button
                className=""
                onClick={() => getChats(user.uid, user.name, user.status)}
              >
                <li key={user.uid} className="">
                  <div>
                    <p>{user.name}</p>
                    <p className=" text-gray-600 ">{user.status}</p>
                  </div>
                </li>
              </button>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
};

export default UsersList;
