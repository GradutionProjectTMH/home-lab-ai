import { createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { User } from "../../types/common";

type EtherState = ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;

const etherSlice = createSlice<EtherState, SliceCaseReducers<EtherState>>({
	name: "etherSlice",
	initialState: new ethers.providers.JsonRpcProvider(),
	reducers: {
		initiateEther: (state, action: PayloadAction<EtherState>) => action.payload,
	},
});

export const { initiateEther } = etherSlice.actions;

export default etherSlice.reducer;
