import { userStore } from "../store/UserStore";
import { db } from "../firebase";
import { get, ref } from "firebase/database";
import { messageStore } from "../store/MessageStore";

const UsersList = () => {
  const users = userStore((state) => state.users);
  const userId = userStore((state) => state.uid);
  const setMessages = messageStore((state) => state.setMessages);
  const setSelectedUser = userStore((state) => state.setSelectedUser);

  const getChats = (uid: string, name: string, status: string) => {
    try {
      console.log(userId, uid);
      setSelectedUser({ name, uid, status });
      const chatRefs = ref(db, "messages/" + userId + "/" + uid);
      get(chatRefs).then((snapshot) => {
        console.log(snapshot.val());
        if (snapshot.exists()) {
          console.log(snapshot.val());
          const data = snapshot.val();
          const messages = Object.keys(data).map((key) => ({
            text: data[key].text,
            uid: data[key].uid,
            name: data[key].name,
          }));
          setMessages(messages);
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
      <ul className=" flex flex-col grow">
        {users.map((user) => {
          if (user.uid !== userId) {
            return (
              <button
                className=""
                onClick={() => getChats(user.uid, user.name, user.status)}
              >
                <li key={user.uid}>
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
