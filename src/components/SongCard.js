import React from "react";
import "./SongCard.css"; // optional: separate CSS file

function SongCard({ song, onFavorite }) {
  return (
    <div className="song-card">
      {song.coverUrl && (
        <img className="cover-img" src={song.coverUrl} alt={`${song.title} cover`} />
      )}
      <h3>{song.title}</h3>
      <p><strong>Artist:</strong> {song.artist}</p>
      <p><strong>Genre:</strong> {song.genre}</p>
      {song.notes && <p><em>{song.notes}</em></p>}
      {onFavorite && (
        <button className="fav-btn" onClick={onFavorite}>❤️ Favorite</button>
      )}
    </div>
  );
}

export default SongCard;
