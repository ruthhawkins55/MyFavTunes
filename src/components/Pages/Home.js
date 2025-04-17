import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import SongCard from "../SongCard.js";
import "../styles.css";

function Home({ user }) {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const q = query(collection(db, "songs"), orderBy("title"));
      const snapshot = await getDocs(q);
      const songList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSongs(songList);
    };

    fetchSongs();
  }, []);

  const handleFavorite = async (songId) => {
    if (!user) {
      alert("Please log in to favorite songs.");
      return;
    }

    await addDoc(collection(db, "favorites"), {
      songId,
      userId: user.uid,
      favoritedAt: new Date(),
    });
  };

  return (
    <div className="song-list">
      {songs.map(song => (
        <SongCard key={song.id} song={song} onFavorite={() => handleFavorite(song.id)} />
      ))}
    </div>
  );
}

export default Home;
