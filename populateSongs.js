import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD69s09cCYnJ4DUNFaQjWPofmeymkkXiEg",
  authDomain: "myfavtunes-92ddf.firebaseapp.com",
  projectId: "myfavtunes-92ddf",
  storageBucket: "myfavtunes-92ddf.firebasestorage.app",
  messagingSenderId: "454388875717",
  appId: "1:454388875717:web:24b4f15e962fc932a70bac",
  measurementId: "G-8NRLXCJ1KX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const songs = [
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    genre: "Pop",
    album: "After Hours",
    coverUrl: "https://i.imgur.com/O3ZCpsK.jpg",
    notes: "Energetic and nostalgic"
  },
  {
    title: "Cruel Summer",
    artist: "Taylor Swift",
    genre: "Pop",
    album: "Lover",
    coverUrl: "https://i.imgur.com/TpUazfG.jpg",
    notes: "Top-down driving anthem"
  },
  {
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    genre: "Alternative Pop",
    album: "SOUR",
    coverUrl: "https://i.imgur.com/h1JhC44.jpg",
    notes: "Breakup energy"
  },
  {
    title: "August",
    artist: "Taylor Swift",
    genre: "Indie Folk",
    album: "Folklore",
    coverUrl: "https://i.imgur.com/YZG48tW.jpg",
    notes: "Bittersweet and dreamy"
  },
  {
    title: "Ivy",
    artist: "Taylor Swift",
    genre: "Folk",
    album: "Evermore",
    coverUrl: "https://i.imgur.com/J5bEJ4v.jpg",
    notes: "Haunting and emotional"
  },
  {
    title: "Thinkin Bout You",
    artist: "Frank Ocean",
    genre: "R&B",
    album: "Channel Orange",
    coverUrl: "https://i.imgur.com/NKmYZcG.jpg",
    notes: "Smooth, emotional vocal delivery"
  },
  {
    title: "Pink + White",
    artist: "Frank Ocean",
    genre: "R&B",
    album: "Blonde",
    coverUrl: "https://i.imgur.com/CU44Od1.jpg",
    notes: "Gentle and uplifting"
  },
  {
    title: "Most Girls",
    artist: "Hailee Steinfeld",
    genre: "Pop",
    album: "Most Girls - Single",
    coverUrl: "https://i.imgur.com/nIYaAnu.jpg",
    notes: "Empowering pop anthem"
  },
  {
    title: "Into You",
    artist: "Ariana Grande",
    genre: "Pop",
    album: "Dangerous Woman",
    coverUrl: "https://i.imgur.com/NJ8lpN5.jpg",
    notes: "Electrifying and sultry"
  },
  {
    title: "One More Time",
    artist: "Daft Punk",
    genre: "Electronic",
    album: "Discovery",
    coverUrl: "https://i.imgur.com/YPZ5VDu.jpg",
    notes: "Futuristic dance floor classic"
  },
  {
    title: "Loyal",
    artist: "Chris Brown",
    genre: "Hip-Hop/R&B",
    album: "X",
    coverUrl: "https://i.imgur.com/5J3r3wa.jpg",
    notes: "Club hit"
  },
  {
    title: "Sofia",
    artist: "Clairo",
    genre: "Bedroom Pop",
    album: "Immunity",
    coverUrl: "https://i.imgur.com/U5u6zIW.jpg",
    notes: "Tender and raw"
  }
];

const uploadSongs = async () => {
  for (const song of songs) {
    await addDoc(collection(db, "songs"), song);
    console.log(`Uploaded: ${song.title}`);
  }
};

uploadSongs();
