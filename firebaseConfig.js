// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeAuth , getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6fbMG_Kh9_xIJPVJpE4WxKJ9O2_f9u9U",
  authDomain: "leazzy.firebaseapp.com",
  databaseURL: "https://leazzy-default-rtdb.firebaseio.com",
  projectId: "leazzy",
  storageBucket: "leazzy.firebasestorage.app",
  messagingSenderId: "22015092534",
  appId: "1:22015092534:web:631ffa790a126578923597",
  measurementId: "G-Y7716DRKXQ"
};
 
// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Analytics only if supported
export const initAnalytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};