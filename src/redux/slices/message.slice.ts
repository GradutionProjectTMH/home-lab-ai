import { createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";

export type MessageType = "ERROR" | "WARNING" | "INFO" | "SUCCESS" | "LOADING";
export type Message = {
	type: MessageType;
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

		pushSuccess: (state, action: PayloadAction<string>) => {
			state.push({
				type: "SUCCESS",
				value: action.payload,
			});
		},

		pushLoading: (state, action: PayloadAction<string>) => {
			state.push({
				type: "LOADING",
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

export const { pushError, pushWarning, pushInfo, pushSuccess, popMessage, pushLoading } = MessageSlice.actions;

export default MessageSlice.reducer;
