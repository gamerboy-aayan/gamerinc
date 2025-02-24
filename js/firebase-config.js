// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAZih7CUqX78SMs4lSKARdtgh-KgBBt7_E",
    authDomain: "gamer-inc.firebaseapp.com",
    projectId: "gamer-inc",
    storageBucket: "gamer-inc.firebasestorage.app",
    messagingSenderId: "419884294647",
    appId: "1:419884294647:web:5d269a780cfa073f464ef2",
    databaseURL: "https://gamer-inc-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();