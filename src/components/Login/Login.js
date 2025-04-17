import React from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase/firebaseConfig.js";
import "../styles.css";

function Login({ user, setUser }) {
  const handleLogin = async () => {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login with Google</button>
      )}
    </div>
  );
}

export default Login;
