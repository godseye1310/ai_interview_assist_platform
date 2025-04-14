// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyCJrtxGSahA_G9xFppisqVp0pbpoR6jgGU",
	authDomain: "voiceprepai.firebaseapp.com",
	projectId: "voiceprepai",
	storageBucket: "voiceprepai.firebasestorage.app",
	messagingSenderId: "680469722176",
	appId: "1:680469722176:web:9a15fe91b65c8f092fdba5",
	measurementId: "G-KM7Z55B41Q",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
