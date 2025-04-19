import React, { useState } from "react";
import { useParams } from "react-router-dom";

function Notebook({ user }) {
  const { songId } = useParams();
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, notes]);
    setNotes("");
  };

  if (!user) return <p>Please log in to access the notebook.</p>;

  return (
    <div className="notebook-page">
      <h2>Notebook for Song ID: {songId}</h2>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write your notes here..."
      ></textarea>
      <button onClick={handleSaveNote}>Save Note</button>
      <div className="saved-notes">
        <h3>Saved Notes</h3>
        <ul>
          {savedNotes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Notebook;