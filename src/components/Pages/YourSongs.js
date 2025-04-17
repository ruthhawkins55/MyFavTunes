import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
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
          return { id, ...songDoc.data() };
        })
      );

      setFavorites(favoriteSongs);
    };

    fetchFavorites();
  }, [user]);

  if (!user) return <p>Please log in to see your favorites.</p>;

  return (
    <div className="song-list">
      <h2>Your Favorite Songs</h2>
      {favorites.length > 0 ? (
        favorites.map(song => (
          <SongCard key={song.id} song={song} />
        ))
      ) : (
        <p>No favorites yet.</p>
      )}
    </div>
  );
}

export default YourSongs;
