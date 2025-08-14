// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB_9t2s6gv43J9fKdUI1DLl4Z3v9yiJHnk",
  authDomain: "aeither-e6a79.firebaseapp.com",
  databaseURL: "https://aeither-e6a79-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aeither-e6a79",
  storageBucket: "aeither-e6a79.firebasestorage.app",
  messagingSenderId: "932846636737",
  appId: "1:932846636737:web:c9d2121791f7669aeace40",
  measurementId: "G-04KH9RD19G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export const setUpRecaptcha = (number) => {
  const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    size: 'invisible', // or 'normal'
    callback: () => {
      console.log('reCAPTCHA solved, sending OTP...');
    }
  });

  return signInWithPhoneNumber(auth, number, recaptchaVerifier);
};


export { auth };

