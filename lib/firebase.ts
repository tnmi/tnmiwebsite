// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { serverTimestamp } from 'firebase/firestore';
import { useAuthStore } from "@/lib/store";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGNOttjl5rhi6_G-ZFf0YNKODE7uxP5Ps",
  authDomain: "tnmi-8d8f5.firebaseapp.com",
  projectId: "tnmi-8d8f5",
  storageBucket: "tnmi-8d8f5.firebasestorage.app",
  messagingSenderId: "194429268019",
  appId: "1:194429268019:web:608d250889c8c3e3deb346"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app