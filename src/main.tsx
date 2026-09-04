import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDk6tw0jfgUzfMA0xJHqKzDWU7MWyHF7Zc",
  authDomain: "awesome-89e82.firebaseapp.com",
  projectId: "awesome-89e82",
  storageBucket: "awesome-89e82.firebasestorage.app",
  messagingSenderId: "1064411966305",
  appId: "1:1064411966305:web:295b83b313e8686104b320",
  measurementId: "G-YSKHLLBSJF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
