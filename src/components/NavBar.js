import React from "react";
import { Link } from "react-router-dom";
import Login from "./Login/Login.js";
import "./styles.css";

function NavBar({ user, setUser }) {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/yoursongs">Your Songs</Link>
      <Link to="/about">About</Link>
      <Login user={user} setUser={setUser} />
    </nav>
  );
}

export default NavBar;
