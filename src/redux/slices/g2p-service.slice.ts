import { createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import axios, { AxiosInstance } from "axios";

type G2PConfig = {
	baseUrl: string;
};

const g2pSlice = createSlice<AxiosInstance | null, SliceCaseReducers<AxiosInstance | null>>({
	name: "g2pApi",
	initialState: null,
	reducers: {
		initiateG2p: (state, action: PayloadAction<G2PConfig>) => {
			const api = axios.create({
				baseURL: action.payload.baseUrl,
				headers: {
					"ngrok-skip-browser-warning": "true",
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

export const { initiateG2p } = g2pSlice.actions;

export default g2pSlice.reducer;
