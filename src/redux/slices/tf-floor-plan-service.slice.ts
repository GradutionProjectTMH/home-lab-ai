import { createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import axios, { AxiosInstance } from "axios";

type TFFloorPlanConfig = {
	baseUrl: string;
};

const tfFloorPlan = createSlice<AxiosInstance | null, SliceCaseReducers<AxiosInstance | null>>({
	name: "tfFloorPlanApi",
	initialState: null,
	reducers: {
		initiateTFFloorPlan: (state, action: PayloadAction<TFFloorPlanConfig>) => {
			const api = axios.create({
				baseURL: action.payload.baseUrl,
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

export const { initiateTFFloorPlan } = tfFloorPlan.actions;

export default tfFloorPlan.reducer;
