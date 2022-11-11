import { createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import { User } from "../../types/common";

type ErrorState = string[];

const errorSlice = createSlice<ErrorState, SliceCaseReducers<ErrorState>>({
	name: "errorSlice",
	initialState: [],
	reducers: {
		pushError: (state, action: PayloadAction<string>) => {
			state.push(action.payload);
		},
		popError: (state, action: PayloadAction<number>) => {
			if (state.length == action.payload) return [];
			return state.slice(-action.payload);
		},
	},
});

export const { pushError, popError } = errorSlice.actions;

export default errorSlice.reducer;
