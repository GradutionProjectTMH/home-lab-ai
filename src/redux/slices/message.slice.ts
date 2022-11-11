import { createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";

type Message = {
	type: "ERROR" | "WARNING" | "INFO" | "SUCCESS";
	value: string;
};

type MessageState = Message[];

const MessageSlice = createSlice<MessageState, SliceCaseReducers<MessageState>>({
	name: "MessageSlice",
	initialState: [],
	reducers: {
		pushError: (state, action: PayloadAction<string>) => {
			state.push({
				type: "ERROR",
				value: action.payload,
			});
		},

		pushWarning: (state, action: PayloadAction<string>) => {
			state.push({
				type: "WARNING",
				value: action.payload,
			});
		},

		pushInfo: (state, action: PayloadAction<string>) => {
			state.push({
				type: "INFO",
				value: action.payload,
			});
		},

		popMessage: (state, action: PayloadAction<boolean>) => {
			if (action.payload) return [];

			if (state.length == 1) return [];
			return state.slice(-1);
		},
	},
});

export const { pushError, pushWarning, pushInfo, popMessage } = MessageSlice.actions;

export default MessageSlice.reducer;
