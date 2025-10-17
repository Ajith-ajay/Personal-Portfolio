// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBBJzoL4oMDUwhTrzdFVyEsT3rERBt7pHM",
  authDomain: "myprotfoliostu.firebaseapp.com",
  projectId: "myprotfoliostu",
  storageBucket: "myprotfoliostu.firebasestorage.app",
  messagingSenderId: "713568866951",
  appId: "1:713568866951:web:c446e224283d89b7ff9e22",
  measurementId: "G-FNK4KSF42P",
};

// Prevent re-initializing Firebase on hot reloads (Next.js dev mode)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Only enable analytics in browser
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log("Firebase Analytics initialized");
      logEvent(analytics, 'page_view', { page: 'portfolio' });
    }
  });
}


export { app, analytics };