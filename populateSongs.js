import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, updateDoc, doc, getDocs, query, where, deleteDoc } from "firebase/firestore";

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
    coverUrl: "/The_Weeknd_-_Blinding_Lights.png", 
    notes: "Energetic and nostalgic"
  },
  {
    title: "Cruel Summer",
    artist: "Taylor Swift",
    genre: "Pop",
    album: "Lover",
    coverUrl: "/ab67616d0000b273e787cffec20aa2a396a61647.jpeg", 
    notes: "Top-down driving anthem"
  },
  {
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    genre: "Alternative Pop",
    album: "SOUR",
    coverUrl: "/df830050-4e96-411c-9402-eb13419a1545.avif",
    notes: ""
  },
  {
    title: "August",
    artist: "Taylor Swift",
    genre: "Indie Folk",
    album: "Folklore",
    coverUrl: "/yxnrpl4t5uc51.webp", 
    notes: "Bittersweet and dreamy"
  },
  {
    title: "Ivy",
    artist: "Taylor Swift",
    genre: "Folk",
    album: "Evermore",
    coverUrl: "/images.jpeg",
    notes: "Haunting and emotional"
  },
  {
    title: "Thinkin Bout You",
    artist: "Frank Ocean",
    genre: "R&B",
    album: "Channel Orange",
    coverUrl: "/ab67616d0000b273f11f1c4ad183b7fa625f8534.jpeg",
    notes: "Smooth, emotional vocal delivery"
  },
  {
    title: "Pink + White",
    artist: "Frank Ocean",
    genre: "R&B",
    album: "Blonde",
    coverUrl: "/ab67616d0000b273c5649add07ed3720be9d5526.jpeg",
    notes: "Gentle and uplifting"
  },
  {
    title: "Most Girls",
    artist: "Hailee Steinfeld",
    genre: "Pop",
    album: "Most Girls - Single",
    coverUrl: "/Hailee_Steinfeld_-_Most_Girls_(single_cover).jpg",
    notes: "Empowering pop anthem"
  },
  {
    title: "Into You",
    artist: "Ariana Grande",
    genre: "Pop",
    album: "Dangerous Woman",
    coverUrl: "/Ariana_Grande_-_Dangerous_Woman_(Official_Album_Cover).png",
    notes: "Electrifying and sultry"
  },
  {
    title: "One More Time",
    artist: "Daft Punk",
    genre: "Electronic",
    album: "Discovery",
    coverUrl: "/One_More_Time.webp",
    notes: "Futuristic dance floor classic"
  },
  {
    title: "Loyal",
    artist: "Chris Brown",
    genre: "Hip-Hop/R&B",
    album: "X",
    coverUrl: "/500x500.jpg",
    notes: "Club hit"
  },
  {
    title: "Sofia",
    artist: "Clairo",
    genre: "Bedroom Pop",
    album: "Immunity",
    coverUrl: "/ab67616d0000b27333ccb60f9b2785ef691b2fbc.jpeg",
    notes: "Tender and raw"
  }
];

const uploadSongs = async () => {
  for (const song of songs) {
    const q = query(collection(db, "songs"), where("title", "==", song.title));
    const existingSongs = await getDocs(q);

    if (!existingSongs.empty) {
      // Update the existing song
      const songDoc = existingSongs.docs[0].ref;
      await updateDoc(songDoc, song);
      console.log(`Updated: ${song.title}`);
    } else {
      // Add a new song
      await addDoc(collection(db, "songs"), song);
      console.log(`Uploaded: ${song.title}`);
    }
  }
};

const removeDuplicateSongs = async () => {
  const q = query(collection(db, "songs"), where("title", "==", "August"));
  const snapshot = await getDocs(q);

  if (snapshot.docs.length > 1) {
    // Keep the first entry and delete the rest
    for (let i = 1; i < snapshot.docs.length; i++) {
      await deleteDoc(snapshot.docs[i].ref);
      console.log(`Deleted duplicate: ${snapshot.docs[i].id}`);
    }
  }
};

const removeAllDuplicates = async () => {
  const snapshot = await getDocs(collection(db, "songs"));
  const seenTitles = new Set();

  for (const doc of snapshot.docs) {
    const song = doc.data();
    if (seenTitles.has(song.title)) {
      // Delete duplicate entry
      await deleteDoc(doc.ref);
      console.log(`Deleted duplicate: ${song.title}`);
    } else {
      // Add title to the set
      seenTitles.add(song.title);
    }
  }
};

uploadSongs();
removeDuplicateSongs();
removeAllDuplicates();
