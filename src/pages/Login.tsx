import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { userStore } from "../store/UserStore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const setIds = userStore((state) => state.setIds);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      const authForUserDetails = getAuth();
      const user = authForUserDetails.currentUser;
      //console.log(user);
      if (!user) return;
      const name = user?.displayName;
      const id = user?.uid;
      //console.log(name, id);
      setIds(name || "John Doe", id);
      navigate("/chat");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <button onClick={handleGoogleSignIn} className="">
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
