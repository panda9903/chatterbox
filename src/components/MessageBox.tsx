import React, { useState } from "react";
import { Input } from "react-chat-elements";
import { Button } from "react-chat-elements";
import { db, auth } from "../firebase";
import { get, push, ref, set } from "firebase/database";
import { messageStore } from "../store/MessageStore";
import { userStore } from "../store/UserStore";

const MessageBox = () => {
  const [message, setMessage] = useState("");
  const addMessage = messageStore((state) => state.addMessage);
  const name = userStore((state) => state.name);

  const getMessages = () => {
    get(ref(db, "messages")).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        //addMessage(snapshot.val());
      } else {
        console.log("No data available");
      }
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    push(ref(db, "messages/" + name + "/" + "Chans"), {
      text: message,
      name: name,
    }).then(() => {
      //getMessages();
    });
  };

  return (
    <div className=" absolute bottom-4 flex flex-row grow">
      <Input
        placeholder="Type here..."
        autofocus
        className=" w-3/4"
        onSubmit={sendMessage}
        maxHeight={100}
        onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
          setMessage(e.target.value)
        }
      />
      <Button text={"Send"} onClick={sendMessage} title="Send" />
    </div>
  );
};

export default MessageBox;
