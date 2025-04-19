import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Notebook.css";

function Notebook({ user, songs }) {
  const { songId } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState({
    likeMost: "",
    emotions: "",
    memories: ""
  });
  const song = songs && Array.isArray(songs) ? songs.find((s) => s.id === songId) : null;

  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes-${songId}`);
    try {
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error("Failed to parse saved notes:", error);
      setNotes({ likeMost: "", emotions: "", memories: "" });
    }
  }, [songId]);

  const handleSaveNote = () => {
    localStorage.setItem(`notes-${songId}`, JSON.stringify(notes));
  };

  const handleChange = (field, value) => {
    setNotes((prevNotes) => ({ ...prevNotes, [field]: value }));
  };

  const handleFavoriteToggle = (id) => {
    console.log(`Favorite toggled for song with id: ${id}`);
  };

  if (!user) return <p>Please log in to access the notebook.</p>;

  if (!songs || songs.length === 0) {
    return <p>Loading songs...</p>;
  }

  return (
    <div className="notebook-page">
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      <div className="notebook-container">
        <div className="notebook-paper">
          <h2>Notebook for {song ? song.title : "Unknown Song"}</h2>
          <p className="prompt">What do you like most about this song?</p>
          <textarea
            className="lined-paper"
            value={notes.likeMost}
            onChange={(e) => handleChange("likeMost", e.target.value)}
            placeholder="Write your notes here..."
          ></textarea>
          <p className="prompt">What emotions does this song evoke?</p>
          <textarea
            className="lined-paper"
            value={notes.emotions}
            onChange={(e) => handleChange("emotions", e.target.value)}
            placeholder="Write your notes here..."
          ></textarea>
          <p className="prompt">Any memories associated with this song?</p>
          <textarea
            className="lined-paper"
            value={notes.memories}
            onChange={(e) => handleChange("memories", e.target.value)}
            placeholder="Write your notes here..."
          ></textarea>
          <button onClick={handleSaveNote}>Save Note</button>
        </div>
        <div className="saved-notes">
          <h3>Saved Notes</h3>
          <ul>
            <li><strong>What you like most:</strong> {notes.likeMost}</li>
            <li><strong>Emotions evoked:</strong> {notes.emotions}</li>
            <li><strong>Memories:</strong> {notes.memories}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Notebook;