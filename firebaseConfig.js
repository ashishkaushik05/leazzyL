// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { 
  initializeFirestore, 
  getFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
  CACHE_SIZE_UNLIMITED 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6fbMG_Kh9_xIJPVJpE4WxKJ9O2_f9u9U",
  authDomain: "leazzy.firebaseapp.com",
  databaseURL: "https://leazzy-default-rtdb.firebaseio.com",
  projectId: "leazzy",
  storageBucket: "leazzy.appspot.com",
  messagingSenderId: "22015092534",
  appId: "1:22015092534:web:631ffa790a126578923597",
  measurementId: "G-Y7716DRKXQ"
};
 
// Initialize Firebase with proper singleton pattern
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firestore with settings optimized for React Native
// Using the new persistence API for better offline support
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager({
      experimentalForceOwningTab: true
    })
  }),
  experimentalForceLongPolling: true // Force long polling for mobile
});

// Initialize Storage
export const storage = getStorage(app);

// Initialize Analytics only if supported
export const initAnalytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};