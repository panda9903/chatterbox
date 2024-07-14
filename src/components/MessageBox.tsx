import React, { useEffect, useState } from "react";
import { Input } from "react-chat-elements";
import { Button } from "react-chat-elements";
import { db } from "../firebase";
import { get, onValue, push, ref, set } from "firebase/database";
import { messageStore } from "../store/MessageStore";
import { userStore } from "../store/UserStore";

const MessageBox = () => {
  const [message, setMessage] = useState("");
  const setMessages = messageStore((state) => state.setMessages);
  const name = userStore((state) => state.name);
  const selectedUser = userStore((state) => state.selectedUser);
  const userId = userStore((state) => state.uid);

  const [showMessageBox, setShowMessageBox] = useState(false);

  useEffect(() => {
    if (selectedUser.uid !== "") {
      setShowMessageBox(true);
    } else {
      setShowMessageBox(false);
    }
  }, [selectedUser]);

  useEffect(() => {
    onValue(ref(db, "messages/" + userId), (snapshot) => {
      if (snapshot.exists()) {
        console.log("From DB", snapshot.val());
        const data = snapshot.val();
        const messages = data[selectedUser.uid];

        const messagesArray = Object.keys(messages).map((key) => ({
          text: messages[key].text,
          uid: messages[key].uid,
          name: messages[key].name,
        }));
        setMessages(messagesArray);
        console.log("messagesArray", messagesArray);
      } else {
        console.log("No data available");
      }
    });
  }, []);

  const sendMessage = async (e) => {
    try {
      e.preventDefault();
      if (message === "") return;
      console.log("messages/" + userId + "/" + selectedUser.uid);
      console.log("messages/" + selectedUser.uid + "/" + userId);
      push(ref(db, "messages/" + userId + "/" + selectedUser.uid), {
        text: message,
        uid: userId,
        name: name,
      }).then(() => {
        push(ref(db, "messages/" + selectedUser.uid + "/" + userId), {
          text: message,
          uid: userId,
          name: name,
        });
      });
    } catch (error) {
      console.log("Error in sendMessage");
    }
  };
  return (
    <div className=" absolute bottom-4 flex flex-row grow">
      {showMessageBox === true ? (
        <>
          <Input
            placeholder="Type here..."
            autofocus
            className=" w-3/4"
            onSubmit={sendMessage}
            maxHeight={100}
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setMessage(e.target.value)}
          />
          <Button text={"Send"} onClick={sendMessage} title="Send" />
        </>
      ) : (
        <p>Select a user</p>
      )}
    </div>
  );
};

export default MessageBox;
