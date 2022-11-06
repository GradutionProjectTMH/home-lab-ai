import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slices/user.slice";
import environmentSlice from "../slices/environment.slice";
import logger from "redux-logger";

const rootReducer = {
	user: userSlice,
	environment: environmentSlice,
};

export const store = configureStore({
	reducer: rootReducer,
	middleware: [logger],
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
