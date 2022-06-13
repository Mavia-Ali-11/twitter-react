import { initializeApp } from "firebase/app";

import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateEmail,
    sendEmailVerification,
    updatePassword,
    sendPasswordResetEmail,
    reauthenticateWithCredential,
    EmailAuthProvider
} from "firebase/auth";

import { 
    getFirestore, 
    doc, 
    addDoc, 
    setDoc, 
    getDoc, 
    collection, 
    getDocs, 
    query,
    where,
    onSnapshot,
    orderBy,
    updateDoc, 
    deleteField,
    increment,
    arrayUnion,
    limit
} from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyCsGFnlHmhoyzRqwkkae5vP7m5bBjrUrR4",
  authDomain: "twitter-ma.firebaseapp.com",
  projectId: "twitter-ma",
  storageBucket: "twitter-ma.appspot.com",
  messagingSenderId: "452998100193",
  appId: "1:452998100193:web:dc6e33af7ca9bec99873a0",
  measurementId: "G-6JEB7Q2FFS"
});

const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

export { 
    auth,
    getAuth,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateEmail,
    sendEmailVerification,
    updatePassword,
    sendPasswordResetEmail,
    reauthenticateWithCredential,
    EmailAuthProvider,

    db,
    doc,
    setDoc,
    getDoc,
    addDoc,
    collection,
    getDocs,
    query,
    where,
    onSnapshot,
    orderBy,
    updateDoc,
    deleteField,
    increment,
    arrayUnion,
    limit,

    storage,
    ref,
    uploadBytes,
    getDownloadURL,
};