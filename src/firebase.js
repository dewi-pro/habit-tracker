import { getAnalytics } from 'firebase/analytics';
// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASORuM2-qgSNVMnXfWPYqqD01XyD5EmdM",
  authDomain: "habit-tracker-73efe.firebaseapp.com",
  projectId: "habit-tracker-73efe",
  storageBucket: "habit-tracker-73efe.firebasestorage.app",
  messagingSenderId: "1083998209045",
  appId: "1:1083998209045:web:63d6432e9a12c1d4b57a1c",
  measurementId: "G-H7L0VQXDE4"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
