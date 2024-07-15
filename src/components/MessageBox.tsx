import React, { useEffect, useState } from "react";
import { Input } from "react-chat-elements";
import { Button } from "react-chat-elements";
import { db } from "../firebase";
import { get, onValue, push, ref, serverTimestamp } from "firebase/database";
import { messageStore } from "../store/MessageStore";
import { userStore } from "../store/UserStore";
import { useShallow } from "zustand/react/shallow";

const MessageBox = () => {
  const [message, setMessage] = useState("");
  const setMessages = messageStore((state) => state.setMessages);
  const name = userStore((state) => state.name);
  const { SUUid } = userStore(
    useShallow((state) => ({
      SUName: state.selectedUser.name,
      SUUid: state.selectedUser.uid,
      SUStatus: state.selectedUser.status,
    }))
  );
  const userId = userStore((state) => state.uid);

  const getStatusOfSelectedUser = get(ref(db, "users/" + SUUid)).then(
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        return data.status;
      }
    }
  );

  const [showMessageBox, setShowMessageBox] = useState(false);

  useEffect(() => {
    if (SUUid !== "") {
      setShowMessageBox(true);
    } else {
      setShowMessageBox(false);
    }
  }, [SUUid]);

  useEffect(() => {
    const messagesRef = ref(db, "messages/" + userId);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messages = data[SUUid];

        if (messages) {
          const messagesArray = Object.keys(messages).map((key) => ({
            text: messages[key].text,
            uid: messages[key].uid,
            name: messages[key].name,
            seen: messages[key].seen,
            timestamp: messages[key].timestamp,
          }));
          setMessages(messagesArray);
        }
      } else {
        setMessages([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [SUUid, setMessages, userId]);

  const sendMessage = async (e) => {
    try {
      e.preventDefault();
      if (message === "") return;
      push(ref(db, "messages/" + userId + "/" + SUUid), {
        text: message,
        uid: userId,
        name: name,
        seen:
          (await getStatusOfSelectedUser) === "online" ? "received" : "sent",
        timestamp: serverTimestamp(),
      }).then(async () => {
        push(ref(db, "messages/" + SUUid + "/" + userId), {
          text: message,
          uid: userId,
          name: name,
          seen:
            (await getStatusOfSelectedUser) === "online" ? "received" : "sent",
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
