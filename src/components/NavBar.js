import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaMusic, FaInfoCircle } from "react-icons/fa";
import Login from "./Login/Login.js";
import "./styles.css";

function NavBar({ user, setUser }) {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className="nav-link">
          <FaHome className="nav-icon" /> Home
        </Link>
        {user && (
          <Link to="/yoursongs" className="nav-link">
            <FaMusic className="nav-icon" /> Your Songs
          </Link>
        )}
        {user && (
          <Link to="/about" className="nav-link">
            <FaInfoCircle className="nav-icon" /> Song Notes
          </Link>
        )}
      </div>
      <div className="nav-login">
        <Login user={user} setUser={setUser} />
      </div>
    </nav>
  );
}

export default NavBar;
