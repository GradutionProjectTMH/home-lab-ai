import { configureStore } from "@reduxjs/toolkit";
import userLoginSlice from "../slices/user-login.slice";
import logger from "redux-logger";

const rootReducer = {
	userLogin: userLoginSlice,
};

export const store = configureStore({
	reducer: rootReducer,
	middleware: [logger],
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
