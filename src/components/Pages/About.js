import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import "./NotesPage.css";
import SongCard from "../SongCard.js";

function NotesPage({ user }) {
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongs = async () => {
      const snapshot = await getDocs(collection(db, "songs"));
      const songList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSongs(songList);
    };

    fetchSongs();
  }, []);

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
              onNotebookClick={() => handleNotebookClick(song.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotesPage;
