// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { store } from "../redux/stores/store.redux";

const env = store.getState().environment.firebase;

const firebaseConfig = {
	apiKey: env.API_KEY,
	authDomain: env.AUTH_DOMAIN,
	projectId: env.PROJECT_ID,
	storageBucket: env.STORAGE_BUCKET,
	messagingSenderId: env.MESSAGING_SENDER_ID,
	appId: env.APP_ID,
	measurementId: env.MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
	await signInWithPopup(auth, provider);
	return auth.currentUser?.getIdToken();
};
