import React, { useEffect, useState } from "react";
import { Input } from "react-chat-elements";
import { Button } from "react-chat-elements";
import { db } from "../firebase";
import { onValue, push, ref, serverTimestamp } from "firebase/database";
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
    const messagesRef = ref(db, "messages/" + userId);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messages = data[selectedUser.uid];

        const messagesArray = Object.keys(messages).map((key) => ({
          text: messages[key].text,
          uid: messages[key].uid,
          name: messages[key].name,
          seen: messages[key].seen,
          timestamp: messages[key].timestamp,
        }));
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [selectedUser, setMessages, userId]);

  const sendMessage = async (e) => {
    try {
      e.preventDefault();
      if (message === "") return;
      push(ref(db, "messages/" + userId + "/" + selectedUser.uid), {
        text: message,
        uid: userId,
        name: name,
        seen: selectedUser.status === "online" ? "received" : "sent",
        timestamp: serverTimestamp(),
      }).then(() => {
        push(ref(db, "messages/" + selectedUser.uid + "/" + userId), {
          text: message,
          uid: userId,
          name: name,
          seen: selectedUser.status === "online" ? "received" : "sent",
          timestamp: serverTimestamp(),
        });
      });
      setMessage("");
    } catch (error) {
      console.log("Error in sendMessage");
    }
  };
  return (
    <div className=" relative sticky bottom-4 flex mt-4 pr-20 gap-4 bg-white">
      {showMessageBox === true ? (
        <>
          <Input
            placeholder="Type here..."
            autofocus
            className=" border border-black"
            onSubmit={sendMessage}
            maxHeight={150}
            value={message}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage(e);
              }
            }}
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setMessage(e.target.value)}
          />
          <Button
            text={">>"}
            onClick={sendMessage}
            title="Send"
            className="w-16"
          />
        </>
      ) : (
        <p>Select a user</p>
      )}
    </div>
  );
};

export default MessageBox;
