// Firebase Configuration
// TODO: Replace with your Firebase project credentials
// Get these from Firebase Console: Project Settings > General > Your apps > Web app

const firebaseConfig = {
  apiKey: "AIzaSyAaOP47iTLRvd2KDih4u0PxhscHRvLomx0",
  authDomain: "plant-house-b407c.firebaseapp.com",
  projectId: "plant-house-b407c",
  storageBucket: "plant-house-b407c.firebasestorage.app",
  messagingSenderId: "27881234890",
  appId: "1:27881234890:web:1347b0ac84262c0f00ef33",
  measurementId: "G-H94B3YQLCW"
};

// Initialize Firebase (using compat version)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Export for use in other files
window.db = db;
