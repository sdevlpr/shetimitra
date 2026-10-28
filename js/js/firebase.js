
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from
  "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA1xXdPrbsGqMWXPRJPeIxf57uMUl_Is1E",
  authDomain: "shetimitra-7a3f3.firebaseapp.com",
  projectId: "shetimitra-7a3f3",
  storageBucket: "shetimitra-7a3f3.firebasestorage.app",
  messagingSenderId: "57300259302",
  appId: "1:57300259302:web:1f56c5c9de5d78373bc627"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  db,
  collection,
  addDoc,
  getDocs,
  serverTimestamp
};
