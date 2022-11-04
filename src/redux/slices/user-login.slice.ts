import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../interfaces/user.interface";

interface initialStateType {
	user: IUser | null;
	isLogin: boolean;
}

const initialState: initialStateType = {
	user: null,
	isLogin: false,
};

const userLogin = createSlice({
	name: "userLogin",
	initialState,
	reducers: {
		addUserLogin: (state, action: PayloadAction<IUser | null>) => {
			state.user = action.payload;
		},
		setIsLogin: (state, action: PayloadAction<boolean>) => {
			state.isLogin = action.payload;
		},
	},
});

export const { addUserLogin, setIsLogin } = userLogin.actions;

export default userLogin.reducer;
