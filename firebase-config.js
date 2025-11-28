// Firebase Configuration
// TODO: Replace with your Firebase project credentials
// Get these from Firebase Console: Project Settings > General > Your apps > Web app

const firebaseConfig = {
  apiKey: "AIzaSyCKlzm9Om4oMAoG2z5-g7aqGVnazpyeTc4",
  authDomain: "book-library-95091.firebaseapp.com",
  projectId: "book-library-95091",
  storageBucket: "book-library-95091.firebasestorage.app",
  messagingSenderId: "976306987324",
  appId: "1:976306987324:web:6293fb860f4ee23045be39",
  measurementId: "G-846KQJ3T7B"
};

// Initialize Firebase (using compat version)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Export for use in other files
window.db = db;
