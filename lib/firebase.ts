// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { serverTimestamp } from 'firebase/firestore';
import { useAuthStore } from "@/lib/store";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Validate required environment variables
const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check for missing environment variables (only in browser/runtime, not during build)
if (typeof window !== 'undefined') {
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error(
      `Missing required Firebase environment variables: ${missingVars.join(', ')}. ` +
      `Please check your environment configuration.`
    );
  }
}

// Your web app's Firebase configuration - using ONLY environment variables
// Use empty strings as fallback during build, actual values will be injected at runtime
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Initialize Firebase App Check for additional security
// This helps protect your backend resources from abuse
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY) {
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (error) {
    console.warn('Firebase App Check initialization failed:', error);
  }
}

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app