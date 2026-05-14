/**
 * src/lib/firebase.ts
 *
 * Central Firebase initialization for ConservationCred (BioPay MVP).
 *
 * Services initialized:
 *  - Firebase App
 *  - Authentication  (phone-OTP primary; email fallback for NGO admins)
 *  - Firestore        (offline persistence enabled for field use)
 *  - Cloud Storage    (photo / voice-note uploads)
 *  - Cloud Messaging  (push notifications for credit awards)
 *
 * All config values are sourced from Vite environment variables so that
 * secrets are never hard-coded in source.  Add the corresponding
 * VITE_FIREBASE_* entries to your .env file (see .env.example).
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  connectAuthEmulator,
  type Auth,
} from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  connectFirestoreEmulator,
  type Firestore,
} from 'firebase/firestore';
import {
  getStorage,
  connectStorageEmulator,
  type FirebaseStorage,
} from 'firebase/storage';
import {
  getMessaging,
  isSupported as isMessagingSupported,
  type Messaging,
} from 'firebase/messaging';

// ---------------------------------------------------------------------------
// 1. Firebase configuration
//    Populated at build-time by Vite from VITE_FIREBASE_* env variables.
// ---------------------------------------------------------------------------
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
};

// ---------------------------------------------------------------------------
// 2. Initialize Firebase App (singleton — safe for HMR / React Strict Mode)
// ---------------------------------------------------------------------------
const app: FirebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

// ---------------------------------------------------------------------------
// 3. Authentication
//    Phone OTP is the primary auth method for field guardians.
//    Email/password is used as a fallback for NGO admins.
// ---------------------------------------------------------------------------
const auth: Auth = getAuth(app);

// ---------------------------------------------------------------------------
// 4. Firestore — with offline-first persistent cache
//    persistentLocalCache enables full offline read/write via IndexedDB.
//    persistentMultipleTabManager allows multiple PWA tabs to stay in sync.
// ---------------------------------------------------------------------------
let db: Firestore;

// initializeFirestore must be called before the first getFirestore() call.
if (getApps().length <= 1) {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
} else {
  // App was already initialized (HMR); reuse the existing Firestore instance.
  db = getFirestore(app);
}

// ---------------------------------------------------------------------------
// 5. Cloud Storage
//    Photo and voice-note uploads for conservation activity submissions.
//    Bucket path convention: /photos/{userId}/{submissionId}/{filename}
// ---------------------------------------------------------------------------
const storage: FirebaseStorage = getStorage(app);

// ---------------------------------------------------------------------------
// 6. Cloud Messaging (FCM)
//    Used for credit-award push notifications ("✓ Patrol verified! +15 CC").
//    Messaging is not available in all browsers (e.g., Firefox/iOS Safari),
//    so we guard initialization with isSupported().
// ---------------------------------------------------------------------------
let messaging: Messaging | null = null;

/**
 * Lazily initializes FCM and returns the Messaging instance, or null if the
 * current browser does not support the Push API.
 *
 * Call this once from your service-worker registration or root component:
 *   const msg = await getMessagingInstance();
 */
export async function getMessagingInstance(): Promise<Messaging | null> {
  if (messaging) return messaging;

  const supported = await isMessagingSupported();
  if (!supported) {
    console.info('[ConservationCred] FCM is not supported in this browser.');
    return null;
  }

  messaging = getMessaging(app);
  return messaging;
}

// ---------------------------------------------------------------------------
// 7. Emulator connections (development only)
//    Set VITE_USE_FIREBASE_EMULATORS=true in your .env.local to enable.
// ---------------------------------------------------------------------------
if (import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
  console.info('[ConservationCred] 🔧 Firebase Emulator Suite connected.');
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
export { app, auth, db, storage };
