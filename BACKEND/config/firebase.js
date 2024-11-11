// config/firebase.js
const { initializeApp } = require("firebase/app");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2rkWR58cSzfaRRRRYnWnGLiQrJwrfVrs",
  authDomain: "mobile-412b7.firebaseapp.com",
  projectId: "mobile-412b7",
  storageBucket: "mobile-412b7.firebasestorage.app",
  messagingSenderId: "796771644252",
  appId: "1:796771644252:web:89ead99f9fe595cece8799",
  measurementId: "G-GW36FTK7VF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the app instance
module.exports = { app };