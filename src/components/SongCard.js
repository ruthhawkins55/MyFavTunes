import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaMusic, FaUser, FaCompactDisc, FaStickyNote } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import "./SongCard.css"; 

const SongCard = ({ song, onFavorite, isFavorited: initialIsFavorited = false, onClick, onNotebookClick, onPlaySong, isHomePage }) => {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);

  useEffect(() => {
    setIsFavorited(initialIsFavorited);
  }, [initialIsFavorited]);

  const handleFavoriteClick = () => {
    const newFavoriteState = !isFavorited;
    setIsFavorited(newFavoriteState);
    if (onFavorite) {
      onFavorite(song.id);
    }
  };

  const handleTakeNotes = () => {
    navigate(`/notes/${song.id}`, {
      state: { song }
    });
  };

  const handleCardClick = () => {
    if (song.audioPath && onClick) {
      onClick(song.audioPath);
    }
  };

  return (
    <div className="song-card" onClick={handleCardClick}>
      {song.coverUrl && (
        <img className="cover-img" src={song.coverUrl} alt={`${song.title} cover`} />
      )}
      <button
        className={`favorite-button ${isFavorited ? "favorited" : ""}`}
        onClick={handleFavoriteClick}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorited ? <FaHeart /> : <FaRegHeart />}
      </button>
      <div className="song-info">
        <p><FaMusic className="icon" /> <strong>Title:</strong> {song.title}</p>
        <p><FaUser className="icon" /> <strong>Artist:</strong> {song.artist}</p>
        <p><FaCompactDisc className="icon" /> <strong>Album:</strong> {song.album}</p>
        {song.notes && (
          <p><FaStickyNote className="icon" /> <strong>Notes:</strong> {song.notes}</p>
        )}
      </div>
      {isHomePage && (
        <button 
          className="play-song-button"
          onClick={(e) => {
            e.stopPropagation();
            onPlaySong(song);
          }}
        >
          Play Song
        </button>
      )}
      {onNotebookClick && (
        <button 
          className="take-notes-button"
          onClick={(e) => {
            e.stopPropagation();
            onNotebookClick();
          }}
        >
          Take Notes
        </button>
      )}
    </div>
  );
};

export default SongCard;
