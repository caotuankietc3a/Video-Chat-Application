import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJdCp00Ul3zmletVhYiL9gfmqzRBxhIu8",
  authDomain: "video-chat-app-2d9d4.firebaseapp.com",
  projectId: "video-chat-app-2d9d4",
  storageBucket: "video-chat-app-2d9d4.appspot.com",
  messagingSenderId: "153972601982",
  appId: "1:153972601982:web:f611ea4b46360635eed42f",
  measurementId: "G-BR903QSC3C",
};

// // Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };
