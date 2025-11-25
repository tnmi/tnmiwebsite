// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app"
import { getAuth, Auth } from "firebase/auth"
import { getFirestore, Firestore, serverTimestamp } from "firebase/firestore"
import { getStorage, FirebaseStorage } from "firebase/storage"
import { useAuthStore } from "@/lib/store";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Your web app's Firebase configuration - using ONLY environment variables
// Use placeholder values during SSR/build, actual values will be used at runtime
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'placeholder',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'placeholder',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'placeholder',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'placeholder',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'placeholder',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'placeholder',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Only initialize Firebase in the browser
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

function initializeFirebase() {
  if (typeof window === 'undefined') {
    // Don't initialize during SSR/build
    return;
  }

  if (app) {
    // Already initialized
    return;
  }

  // Validate environment variables in browser
  const requiredEnvVars = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error(
      `Missing required Firebase environment variables: ${missingVars.join(', ')}. ` +
      `Please check your environment configuration.`
    );
    return;
  }

  // Initialize Firebase
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Initialize Firebase App Check for additional security
  if (process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY) {
    try {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY),
        isTokenAutoRefreshEnabled: true,
      });
    } catch (error) {
      console.warn('Firebase App Check initialization failed:', error);
    }
  }
}

// Getters that ensure Firebase is initialized
export function getAuthInstance(): Auth {
  if (!auth) {
    initializeFirebase();
  }
  return auth!;
}

export function getDbInstance(): Firestore {
  if (!db) {
    initializeFirebase();
  }
  return db!;
}

export function getStorageInstance(): FirebaseStorage {
  if (!storage) {
    initializeFirebase();
  }
  return storage!;
}

export function getAppInstance(): FirebaseApp {
  if (!app) {
    initializeFirebase();
  }
  return app!;
}

// Re-export serverTimestamp for convenience
export { serverTimestamp };

// Initialize on first import in browser (for backward compatibility)
if (typeof window !== 'undefined') {
  initializeFirebase();
}