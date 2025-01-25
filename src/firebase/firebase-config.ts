import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDkkqpwsPOUb5K3mrHslkWkiAI_eMiu7EY",
  authDomain: "social-app-a4d39.firebaseapp.com",
  projectId: "social-app-a4d39",
  storageBucket: "social-app-a4d39.firebasestorage.app",
  messagingSenderId: "1056961458245",
  appId: "1:1056961458245:web:4e2cd8ebc792f3489ab32c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
