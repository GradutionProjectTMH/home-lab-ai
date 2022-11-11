import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slices/user.slice";
import environmentSlice from "../slices/environment.slice";
import logger from "redux-logger";
import firebaseServiceSlice from "../slices/firebase-service.slice";
import g2pServiceSlice from "../slices/g2p-service.slice";
import textRazorServiceSlice from "../slices/textrazor-service.slice";
import errorSlice from "../slices/error.slice";

const rootReducer = {
	user: userSlice,
	error: errorSlice,
	environment: environmentSlice,
	firebaseService: firebaseServiceSlice,
	g2pService: g2pServiceSlice,
	textRazorService: textRazorServiceSlice,
};

export const store = configureStore({
	reducer: rootReducer,
	middleware: [logger],
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
