import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EnvironmentKey } from "../../apis/server/environment.api";

const initialState = {
	// textRazor: {
	// 	API_ENDPOINT: process.env.TEXT_RAZOR_API_ENDPOINT,
	// 	API_KEY: process.env.TEXT_RAZOR_API_KEY,
	// },
	g2p: {
		API_ENDPOINT: process.env.G2P_API_ENDPOINT,
		IMAGE_ENDPOINT: process.env.G2P_IMAGE_ENDPOINT,
	},
	tfFloorPlan: {
		API_ENDPOINT: process.env.TF_FLOOR_PLAN_API_ENDPOINT,
		IMAGE_ENDPOINT: process.env.TF_FLOOR_PLAN_IMAGE_ENDPOINT,
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
	// infura: {
	// 	PROJECT_ID: process.env.INFURA_PROJECT_ID,
	// 	API_KEY_SECRET: process.env.INFURA_API_KEY_SECRET,
	// 	IPFS_API_ENDPOINT: process.env.INFURA_IPFS_API_ENDPOINT,
	// 	DEDICATED_GATEWAY_SUBDOMAIN: process.env.INFURA_DEDICATED_GATEWAY_SUBDOMAIN,
	// },
	server: {
		API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
	},
	isReady: false,
};

export type Environment = typeof initialState;

const environment = createSlice({
	name: "environment",
	initialState,
	reducers: {},
});

export default environment.reducer;
