import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

let authResolve: (uid: string) => void;
let authReject: (err: Error) => void;
const authPromise = new Promise<string>((resolve, reject) => {
    authResolve = resolve;
    authReject = reject;
});

const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
        unsubscribe();
        authResolve(user.uid);
    }
});

// Start anonymous sign-in
signInAnonymously(auth).catch((err) => {
    unsubscribe();
    authReject(err);
});

// Timeout after 15s so the app doesn't hang forever
setTimeout(() => {
    unsubscribe();
    authReject(new Error('Authentication timed out'));
}, 15000);

/**
 * Resolves with the current user's UID once anonymous auth is ready.
 */
export const ensureAuth = (): Promise<string> => authPromise;

// Collection names
export const COLLECTIONS = {
    GAME_SESSIONS: 'gameSessions',
    PARTICIPANTS: 'participants',
    VOTES: 'votes',
    ISSUES: 'issues',
    EMOJIS: 'emojis',
};
