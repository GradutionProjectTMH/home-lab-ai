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

type G2PConfig = {
	baseUrl: string;
};

const g2pSlice = createSlice<AxiosInstance, SliceCaseReducers<AxiosInstance>>({
	name: "g2pApi",
	initialState: api,
	reducers: {
		initiateG2p: (state, action: PayloadAction<G2PConfig>) => {
			state.defaults.baseURL = action.payload.baseUrl;
		},
	},
});

export const { initiateG2p } = g2pSlice.actions;

export default g2pSlice.reducer;
