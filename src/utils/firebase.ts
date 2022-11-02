// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import appConfig from "../configs/env.config";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
	apiKey: appConfig.firebase.API_KEY,
	authDomain: appConfig.firebase.AUTH_DOMAIN,
	projectId: appConfig.firebase.PROJECT_ID,
	storageBucket: appConfig.firebase.STORAGE_BUCKET,
	messagingSenderId: appConfig.firebase.MESSAGING_SENDER_ID,
	appId: appConfig.firebase.APP_ID,
	measurementId: appConfig.firebase.MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();
const provider = new GoogleAuthProvider();

export const signInWithGoogle = (): Promise<string | undefined> => {
	return new Promise((resolve, reject) => {
		signInWithPopup(auth, provider)
			.then(async (result) => {
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential?.accessToken;

				// The signed-in user info.
				const user = result.user;
				const idToken = await auth.currentUser?.getIdToken();
				resolve(idToken);
			})
			.catch((err) => reject(err));
	});
};
