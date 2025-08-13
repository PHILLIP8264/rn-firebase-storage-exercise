import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firestore storage is still down
const firebaseConfig = {
  apiKey: "AIzaSyCw53j3ZqBAQFO_aiMIOebFRK8UxNiGMzA",
  authDomain: "class-activeties.firebaseapp.com",
  projectId: "class-activeties",
  storageBucket: "class-activeties.firebasestorage.app",
  messagingSenderId: "253070327629",
  appId: "1:253070327629:web:a69f6644fe7145909cc104",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
