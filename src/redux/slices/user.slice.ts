import { createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import { User } from "../../types/common";

type UserState = (User & { token?: string }) | null;

const userSlice = createSlice<UserState, SliceCaseReducers<UserState>>({
	name: "userSlice",
	initialState: null,
	reducers: {
		updateUser: (state, action: PayloadAction<UserState>) => action.payload,
	},
});

export const { updateUser } = userSlice.actions;

export default userSlice.reducer;
