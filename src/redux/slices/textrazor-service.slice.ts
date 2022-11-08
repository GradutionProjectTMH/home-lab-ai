import { createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import axios, { AxiosInstance } from "axios";

type TextRazorConfig = {
	endPoint: string;
	apiKey: string;
};

const textRazorSlice = createSlice<AxiosInstance | null, SliceCaseReducers<AxiosInstance | null>>({
	name: "textRazorApi",
	initialState: null,
	reducers: {
		initiateTextRazor: (state, action: PayloadAction<TextRazorConfig>) => {
			const api = axios.create({
				baseURL: action.payload.endPoint,
				headers: {
					"x-requested-with": "*",
					"permit-by-nabatti99": "true",
					"X-TextRazor-Key": action.payload.apiKey,
					"Content-Type": "application/x-www-form-urlencoded",
				},
			});

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
			return api;
		},
	},
});

export const { initiateTextRazor } = textRazorSlice.actions;

export default textRazorSlice.reducer;
