import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
