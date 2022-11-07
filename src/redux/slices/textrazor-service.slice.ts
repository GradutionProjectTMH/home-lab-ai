import { createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import axios, { AxiosInstance } from "axios";

const api = axios.create();

api.interceptors.request.use(
	(config) => {
		console.log(config);
		return config;
	},
	(error) => {
		console.error(error);
		return Promise.reject(error);
	},
);

api.interceptors.response.use(
	(response) => {
		console.log(response);
		return response;
	},
	(error) => {
		console.error(error);
		return Promise.reject(error);
	},
);

type TextRazorConfig = {
	baseUrl: string;
	headers: Record<string, string>;
};

const textRazorSlice = createSlice<AxiosInstance, SliceCaseReducers<AxiosInstance>>({
	name: "textRazorApi",
	initialState: api,
	reducers: {
		initiateTextRazor: (state, action: PayloadAction<TextRazorConfig>) => {
			state.defaults.baseURL = action.payload.baseUrl;
			state.defaults.headers.common = action.payload.headers;
		},
	},
});

export const { initiateTextRazor } = textRazorSlice.actions;

export default textRazorSlice.reducer;
