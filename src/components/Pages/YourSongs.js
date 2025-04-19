import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, query, where, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import SongCard from "../SongCard.js";

function YourSongs({ user }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      const q = query(collection(db, "favorites"), where("userId", "==", user.uid));
      const favSnapshot = await getDocs(q);
      const songIds = favSnapshot.docs.map(doc => doc.data().songId);

      const favoriteSongs = await Promise.all(
        songIds.map(async id => {
          const songDoc = await getDoc(doc(db, "songs", id));
          const songData = songDoc.data();
          return { id, ...songData };
        })
      );

      setFavorites(favoriteSongs);
    };

    fetchFavorites();
  }, [user, favorites]);

  const handleRemoveFavorite = async (songId) => {
    if (!user) return;

    const q = query(
      collection(db, "favorites"),
      where("userId", "==", user.uid),
      where("songId", "==", songId)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      await deleteDoc(snapshot.docs[0].ref);
      setFavorites((prevFavorites) => prevFavorites.filter((song) => song.id !== songId));
    } else {
      console.error("No matching favorite found to remove.");
    }
  };

  if (!user) return <p>Please log in to see your favorites.</p>;

  return (
    <div className="your-songs-page">
      <h2>Your Favorite Songs</h2>
      <div className="song-grid">
        {favorites.length > 0 ? (
          favorites.map(song => (
            <SongCard
              key={`${song.id}-${user.uid}`}
              song={song}
              onFavorite={() => handleRemoveFavorite(song.id)}
              isFavorited={true}
            />
          ))
        ) : (
          <p>No favorites yet.</p>
        )}
      </div>
    </div>
  );
}

export default YourSongs;
