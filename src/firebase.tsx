import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCE4ErSIc8Sct73JclRvFhzI3yrw8O1jUg",
  authDomain: "chatterbox-f1da5.firebaseapp.com",
  databaseURL:
    "https://chatterbox-f1da5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chatterbox-f1da5",
  storageBucket: "chatterbox-f1da5.appspot.com",
  messagingSenderId: "440801753086",
  appId: "1:440801753086:web:64d9e2f3339c2baea832af",
  measurementId: "G-1JKJLV082B",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
