import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, query, where, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import "./NotesPage.css";
import SongCard from "../SongCard.js";

function NotesPage({ user }) {
  const [songs, setSongs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongs = async () => {
      const snapshot = await getDocs(collection(db, "songs"));
      const songList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSongs(songList);
    };

    const fetchFavorites = async () => {
      if (!user) return;
      const q = query(collection(db, "favorites"), where("userId", "==", user.uid));
      const favSnapshot = await getDocs(q);
      const favoriteSongIds = favSnapshot.docs.map(doc => doc.data().songId);
      setFavorites(favoriteSongIds);
    };

    fetchSongs();
    fetchFavorites();
  }, [user]);

  const handleFavoriteToggle = async (songId) => {
    if (!user) {
      alert("Please log in to favorite songs.");
      return;
    }

    const q = query(
      collection(db, "favorites"),
      where("userId", "==", user.uid),
      where("songId", "==", songId)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // Remove from favorites
      await deleteDoc(snapshot.docs[0].ref);
      setFavorites(favorites.filter(id => id !== songId));
    } else {
      // Add to favorites
      await addDoc(collection(db, "favorites"), {
        songId,
        userId: user.uid,
        favoritedAt: new Date(),
      });
      setFavorites([...favorites, songId]);
    }
  };

  const handleNotebookClick = (songId) => {
    navigate(`/notes/${songId}`);
  };

  if (!user) return <p>Please log in to access your notes.</p>;

  return (
    <div className="notes-page">
      <h2>Your Song Notes</h2>
      <div className="song-grid">
        {songs.map(song => (
          <div key={song.id} className="song-card-wrapper">
            <SongCard
              song={song}
              onFavorite={() => handleFavoriteToggle(song.id)}
              isFavorited={favorites.includes(song.id)}
              onNotebookClick={() => handleNotebookClick(song.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotesPage;