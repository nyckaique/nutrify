import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCR6Rnq-FBvP9RjdQf_GkQqF3lX9VlWfoE",
  authDomain: "nutrify-24959.firebaseapp.com",
  projectId: "nutrify-24959",
  storageBucket: "nutrify-24959.appspot.com",
  messagingSenderId: "691342258646",
  appId: "1:691342258646:web:56f1794d7e11736037b477",
  measurementId: "G-CSCNJK7394",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, auth, storage };
