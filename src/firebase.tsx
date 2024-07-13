import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

/* const firebaseConfig = {
  apiKey: "AIzaSyCE4ErSIc8Sct73JclRvFhzI3yrw8O1jUg",
  authDomain: "chatterbox-f1da5.firebaseapp.com",
  databaseURL:
    "https://chatterbox-f1da5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chatterbox-f1da5",
  storageBucket: "chatterbox-f1da5.appspot.com",
  messagingSenderId: "440801753086",
  appId: "1:440801753086:web:64d9e2f3339c2baea832af",
  measurementId: "G-1JKJLV082B",
}; */

const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY}`,
  authDomain: `${import.meta.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN}`,
  databaseURL: `${import.meta.env.VITE_REACT_APP_FIREBASE_DATABASE_URL}`,
  projectId: `${import.meta.env.VITE_REACT_APP_FIREBASE_PROJECT_ID}`,
  storageBucket: `${import.meta.env.VITE_REACT_APP_FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${
    import.meta.env.VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID
  }`,
  appId: `${import.meta.env.VITE_REACT_APP_FIREBASE_APP_ID}`,
  measurementId: `${import.meta.env.VITE_REACT_APP_FIREBASE_MEASUREMENT_ID}`,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
