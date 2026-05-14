import { getApp, getApps, initializeApp } from 'firebase/app'
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const firebaseEnabled = Object.values(firebaseConfig).every(Boolean)

let app = null
let auth = null
let db = null
let storage = null

if (firebaseEnabled) {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
  setPersistence(auth, browserLocalPersistence).catch(() => {})
}

export {
  auth,
  browserLocalPersistence,
  collection,
  createUserWithEmailAndPassword,
  db,
  deleteDoc,
  deleteUser,
  doc,
  firebaseEnabled,
  firebaseSignOut,
  getDoc,
  getDocs,
  getDownloadURL,
  limit,
  query,
  ref,
  setDoc,
  signInWithEmailAndPassword,
  storage,
  uploadString,
  where,
}
