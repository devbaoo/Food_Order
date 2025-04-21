// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADQlFIlbh_wNU69DwT8AN3ccVkKWnmJ_A",
  authDomain: "food-order-dea38.firebaseapp.com",
  projectId: "food-order-dea38",
  storageBucket: "food-order-dea38.firebasestorage.app",
  messagingSenderId: "41177389907",
  appId: "1:41177389907:web:4ad54567dbc335ea1c5fa6",
  measurementId: "G-8753FQRNEV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// initialize auth; only for native platforms (Android and iOS)
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

const firestore = getFirestore();

export { auth, app, firestore };