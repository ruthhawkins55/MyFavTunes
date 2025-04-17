import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import "./About.css";

function About({ user }) {
  const [favoriteArtists, setFavoriteArtists] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchArtists = async () => {
      const q = query(collection(db, "favorites"), where("userId", "==", user.uid));
      const favSnapshot = await getDocs(q);
      const songIds = favSnapshot.docs.map(doc => doc.data().songId);

      const artists = new Set();

      for (let id of songIds) {
        const songDoc = await getDoc(doc(db, "songs", id));
        const data = songDoc.data();
        if (data?.artist) {
          artists.add(data.artist);
        }
      }

      setFavoriteArtists(Array.from(artists));
    };

    fetchArtists();
  }, [user]);

  if (!user) return <p className="about-msg">Please log in to view your favorite artists.</p>;

  return (
    <div className="about-page">
      <h2>Your Favorite Artists 🎧</h2>
      {favoriteArtists.length > 0 ? (
        <ul className="artist-list">
          {favoriteArtists.map((artist, idx) => (
            <li key={idx}>{artist}</li>
          ))}
        </ul>
      ) : (
        <p className="about-msg">You haven’t favorited any songs yet.</p>
      )}
    </div>
  );
}

export default About;
