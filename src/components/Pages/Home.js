import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs, addDoc, query, orderBy, where, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import SongCard from "../SongCard.js";
import { FaGuitar, FaMusic, FaDrum, FaCompactDisc, FaViolin, FaMicrophoneAlt } from "react-icons/fa";
import { GiPianoKeys, GiSaxophone } from "react-icons/gi";
import "../styles.css";
import "./Home.css";

const genreData = [
  {
    name: "Pop",
    icon: <FaMicrophoneAlt className="genre-icon" />,
    description: "Chart-topping hits and catchy melodies"
  },
  {
    name: "Rock",
    icon: <FaGuitar className="genre-icon" />,
    description: "Electric guitars and powerful rhythms"
  },
  {
    name: "Hip-Hop",
    icon: <FaDrum className="genre-icon" />,
    description: "Beats, rhymes, and urban vibes"
  },
  {
    name: "Jazz",
    icon: <GiSaxophone className="genre-icon" />,
    description: "Smooth improvisations and soulful tunes"
  },
  {
    name: "Classical",
    icon: <GiPianoKeys className="genre-icon" />,
    description: "Timeless compositions and orchestral masterpieces"
  }
];

function Home({ user }) {
  const [songs, setSongs] = useState([]);
  const [favoriteSongIds, setFavoriteSongIds] = useState([]);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentCover, setCurrentCover] = useState("/yxnrpl4t5uc51.webp");

  useEffect(() => {
    const fetchSongs = async () => {
      const q = query(collection(db, "songs"), orderBy("title"));
      const snapshot = await getDocs(q);
      const songList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          coverUrl: data.coverUrl || getDefaultCoverUrl(data.artist),
          audioPath: data.audioPath || getDefaultAudioPath(data.title)
        };
      });
      setSongs(songList);
    };

    fetchSongs();
  }, []);

  // Helper function to get default cover URL based on artist
  const getDefaultCoverUrl = (artist) => {
    const defaultCovers = {
      'Taylor Swift': '/0x0.webp',
      'The Weeknd': '/The_Weeknd_-_Blinding_Lights.png',
      'Ariana Grande': '/ariana-grande_MI0005476282-MN0002264745.jpeg',
      'Frank Ocean': '/20CARAMANICA-articleLarge.webp'
    };
    return defaultCovers[artist] || '/yxnrpl4t5uc51.webp';
  };

  // Helper function to get default audio path based on title
  const getDefaultAudioPath = (title) => {
    const audioPaths = {
      "good 4 u": "/good 4 u - Olivia Rodrigo.mp3",
      "Good 4 U": "/good 4 u - Olivia Rodrigo.mp3",
      "GOOD 4 U": "/good 4 u - Olivia Rodrigo.mp3",
      "august": "/Taylor_Swift-August.mp3",
      "August": "/Taylor_Swift-August.mp3",
      "AUGUST": "/Taylor_Swift-August.mp3",
      "Blinding Lights": "/The Weeknd - Blinding Lights (Official Audio).mp3",
      "Cruel Summer": "/Taylor Swift - Cruel Summer.mp3",
      "positions": "/Ariana_Grande_-_positions.mp3",
      "Pink + White": "/Frank Ocean - Pink + White.mp3",
      "Into You": "/Ariana Grande-Into You.mp3",
      "into you": "/Ariana Grande-Into You.mp3",
      "INTO YOU": "/Ariana Grande-Into You.mp3",
      "Ivy": "/Taylor Swift-Ivy(Clean).mp3",
      "ivy": "/Taylor Swift-Ivy(Clean).mp3",
      "IVY": "/Taylor Swift-Ivy(Clean).mp3",
      "Loyal": "/Chris-Brown-Loyal-Feat-Lil-Wayne-Tyga-(HipHopKit.com).mp3",
      "Most Girls": "/Hailee Steinfeld - Most Girls.mp3",
      "One More Time": "/NDAxMTUxODU4NDAxMjA1_VaEulpGbrzE.MP3",
      "Sofia": "/Clairo - Sofia.mp3",
      "Thinkin Bout You": "/thinkin bout you - Tumblr.mp3"
    };
    return audioPaths[title] || null;
  };

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
      await deleteDoc(snapshot.docs[0].ref);
      setFavoriteSongIds(favoriteSongIds.filter((id) => id !== songId));
    } else {
      await addDoc(collection(db, "favorites"), {
        songId,
        userId: user.uid,
        favoritedAt: new Date(),
      });
      setFavoriteSongIds([...favoriteSongIds, songId]);
    }
  };

  const handlePlaySong = (song) => {
    try {
      console.log("Playing song:", song);
      if (audioRef.current) {
        if (currentSong && currentSong.id === song.id && isPlaying) {
          
          return;
        }
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      const audioPath = song.audioPath || getDefaultAudioPath(song.title);
      console.log("Audio path:", audioPath);
      
      if (!audioPath) {
        console.error("No audio path found for song:", song.title);
        return;
      }
      
      audioRef.current = new Audio(audioPath);
      audioRef.current.play()
        .then(() => {
          console.log("Audio started playing successfully");
          setCurrentSong(song);
          setCurrentCover(song.coverUrl);
          setIsPlaying(true);
          document.querySelector('.record').style.animation = 'spin 4s linear infinite';
        })
        .catch(error => {
          console.error("Error playing audio:", error);
        });
    } catch (error) {
      console.error("Error in handlePlaySong:", error);
    }
  };

  const handlePauseClick = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      document.querySelector('.record').style.animation = 'none';
    }
  };

  const handleResumeClick = () => {
    if (audioRef.current && currentSong && !isPlaying) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          document.querySelector('.record').style.animation = 'spin 4s linear infinite';
        });
    }
  };

  const handleStopClick = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      document.querySelector('.record').style.animation = 'none';
    }
  };

  // event listener for when audio ends
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        document.querySelector(".record").classList.remove("spinning");
      });
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', () => {});
      }
    };
  }, []);

  return (
    <div className="home-page">
      <div className="record-player-section" style={{ 
        minHeight: '300px', 
        position: 'relative', 
        marginBottom: '2rem',
        padding: '2rem',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div className="welcome-text">
          <h1>Welcome to MyFavTunes!</h1>
          <p>Your personal music companion where you can discover, play, save, and take notes on your favorite songs. Start your musical journey today!</p>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '40px', 
          marginTop: '20px'
        }}>
          <div className="record-player" style={{ 
            width: '180px', 
            height: '180px', 
            background: '#1a1a1a',
            borderRadius: '12px',
            padding: '15px',
            position: 'relative'
          }}>
            <div className={`record ${isPlaying ? 'spinning' : ''}`} style={{ 
              width: '150px', 
              height: '150px',
              borderRadius: '50%',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <img 
                src={currentSong ? currentSong.coverUrl : currentCover} 
                alt="Album Cover" 
                className="record-image" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
            </div>
            <div className="arm" style={{
              position: 'absolute',
              width: '60px',
              height: '2px',
              backgroundColor: '#666',
              top: '30%',
              right: '-20px',
              transform: 'rotate(30deg)',
              transformOrigin: 'left center',
              zIndex: 2
            }}></div>
          </div>
          <div className="record-player-controls" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px'
          }}>
            {!isPlaying ? (
              <button 
                className="play-button" 
                onClick={() => currentSong ? handleResumeClick() : null}
                style={{ 
                  background: '#2196f3',
                  padding: '8px 24px',
                  borderRadius: '20px',
                  border: 'none',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: currentSong ? 'pointer' : 'not-allowed',
                  width: '100px',
                  fontSize: '14px',
                  opacity: currentSong ? 1 : 0.7
                }}
              >
                PLAY
              </button>
            ) : (
              <button 
                className="pause-button" 
                onClick={handlePauseClick}
                style={{ 
                  background: '#ffc107',
                  padding: '8px 24px',
                  borderRadius: '20px',
                  border: 'none',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  width: '100px',
                  fontSize: '14px'
                }}
              >
                PAUSE
              </button>
            )}
            <button 
              className="stop-button" 
              onClick={handleStopClick}
              style={{ 
                background: '#f44336',
                padding: '8px 24px',
                borderRadius: '20px',
                border: 'none',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100px',
                fontSize: '14px'
              }}
            >
              STOP
            </button>
          </div>
        </div>
        <audio 
          ref={audioRef}
          style={{ display: 'none' }}
        />
      </div>

      <div className="song-section">
        <h2>All Songs</h2>
        <div className="song-grid">
          {songs.map(song => (
            <div key={song.id} className="song-card-wrapper">
              <SongCard
                song={song}
                onFavorite={() => handleFavoriteToggle(song.id)}
                isFavorited={favoriteSongIds.includes(song.id)}
                onPlaySong={handlePlaySong}
                isHomePage={true}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="features-section">
        <div className="feature">
          <h2>Top Genres</h2>
          <div className="genre-list">
            {genreData.map((genre, index) => (
              <div key={index} className="genre-item">
                {genre.icon}
                <span className="genre-name">{genre.name}</span>
                <p className="genre-description">{genre.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="feature">
          <h2>Featured Artists</h2>
          <div className="artist-grid">
            <div className="artist-card">
              <img src="/The_Weeknd_-_Blinding_Lights.png" alt="The Weeknd" />
              <p>The Weeknd</p>
            </div>
            <div className="artist-card">
              <img src="/0x0.webp" alt="Taylor Swift" />
              <p>Taylor Swift</p>
            </div>
            <div className="artist-card">
              <img src="/ariana-grande_MI0005476282-MN0002264745.jpeg" alt="Ariana Grande" />
              <p>Ariana Grande</p>
            </div>
            <div className="artist-card">
              <img src="/20CARAMANICA-articleLarge.webp" alt="Frank Ocean" />
              <p>Frank Ocean</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
