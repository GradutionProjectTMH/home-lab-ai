import { createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";

type FirebaseConfig = {
	apiKey: string;
	authDomain: string;
	projectId: string;
	storageBucket: string;
	messagingSenderId: string;
	appId: string;
	measurementId: string;
};

type FirebaseService = {
	app: FirebaseApp;
	auth: Auth;
} | null;

const firebaseSlice = createSlice<FirebaseService, SliceCaseReducers<FirebaseService>>({
	name: "firebaseApi",
	initialState: null,
	reducers: {
		initiateFirebase: (state, action: PayloadAction<FirebaseConfig>) => {
			const app = initializeApp(action.payload);
			const auth = getAuth(app);

			return { app, auth };
		},
	},
});

export const { initiateFirebase } = firebaseSlice.actions;

export default firebaseSlice.reducer;
