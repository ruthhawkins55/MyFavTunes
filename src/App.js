import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./components/firebase/firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./components/firebase/firebaseConfig.js";
import NavBar from "./components/NavBar.js";
import Home from "./components/Pages/Home.js";
import YourSongs from "./components/Pages/YourSongs.js";
import About from "./components/Pages/About.js";
import Notebook from "./components/Pages/Notebook.js";

function App() {
  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed. User:", user);
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchSongsFromFirestore = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "songs"));
        const fetchedSongs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSongs(fetchedSongs);
      } catch (error) {
        console.error("Failed to fetch songs from Firestore:", error);
      }
    };

    fetchSongsFromFirestore();
  }, []);

  return (
    <Router>
      <NavBar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/yoursongs" element={<YourSongs user={user} />} />
        <Route path="/about" element={<About user={user} songs={songs} />} />
        <Route path="/notes/:songId" element={<Notebook user={user} songs={songs} />} />
      </Routes>
    </Router>
  );
}

export default App;
