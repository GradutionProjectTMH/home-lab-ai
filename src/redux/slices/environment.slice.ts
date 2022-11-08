import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EnvironmentKey } from "../../apis/server/environment.api";

const initialState = {
	textRazor: {
		API_ENDPOINT: process.env.TEXT_RAZOR_API_ENDPOINT,
		API_KEY: process.env.TEXT_RAZOR_API_KEY,
	},
	g2p: {
		API_ENDPOINT: process.env.G2P_API_ENDPOINT,
		IMAGE_ENDPOINT: process.env.G2P_IMAGE_ENDPOINT,
	},
	firebase: {
		API_KEY: process.env.FIREBASE_API_KEY,
		AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
		PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
		STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
		MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
		APP_ID: process.env.FIREBASE_APP_ID,
		MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
	},
	server: {
		API_BASE_URL: process.env.GATSBY_API_BASE_URL,
	},
	isReady: false,
};

export type Environment = typeof initialState;

const environment = createSlice({
	name: "environment",
	initialState,
	reducers: {
		setEnvironment: (state, { payload }: PayloadAction<Record<EnvironmentKey, string>>) => {
			state.textRazor = {
				API_ENDPOINT: payload.TEXT_RAZOR_API_ENDPOINT || state.textRazor.API_ENDPOINT,
				API_KEY: payload.TEXT_RAZOR_API_KEY || state.textRazor.API_KEY,
			};

			state.g2p = {
				API_ENDPOINT: payload.G2P_API_ENDPOINT || state.g2p.API_ENDPOINT,
				IMAGE_ENDPOINT: payload.G2P_IMAGE_ENDPOINT || state.g2p.IMAGE_ENDPOINT,
			};

			state.firebase = {
				API_KEY: payload.FIREBASE_API_KEY || state.firebase.API_KEY,
				AUTH_DOMAIN: payload.FIREBASE_AUTH_DOMAIN || state.firebase.AUTH_DOMAIN,
				PROJECT_ID: payload.FIREBASE_PROJECT_ID || state.firebase.PROJECT_ID,
				STORAGE_BUCKET: payload.FIREBASE_STORAGE_BUCKET || state.firebase.STORAGE_BUCKET,
				MESSAGING_SENDER_ID: payload.FIREBASE_MESSAGING_SENDER_ID || state.firebase.MESSAGING_SENDER_ID,
				APP_ID: payload.FIREBASE_APP_ID || state.firebase.APP_ID,
				MEASUREMENT_ID: payload.FIREBASE_MEASUREMENT_ID || state.firebase.MEASUREMENT_ID,
			};

			state.isReady = true;
		},
	},
});

export const { setEnvironment } = environment.actions;

export default environment.reducer;
