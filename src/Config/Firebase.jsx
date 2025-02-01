import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import FirebaseConfig from './FirebaseConfig';

// Initialize Firebase
const app = initializeApp(FirebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export {auth, db, app};