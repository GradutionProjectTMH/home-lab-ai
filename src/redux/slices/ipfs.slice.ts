import { createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import { create, IPFSHTTPClient } from "ipfs-http-client";

type IpfsState = {
	projectId: string;
	apiKeySecret: string;
	ipfsApiEndpoint: string;
	dedicatedGatewayDomain: string;
};

const ipfsSlice = createSlice<IPFSHTTPClient | null, SliceCaseReducers<IPFSHTTPClient | null>>({
	name: "ipfsSlice",
	initialState: null,
	reducers: {
		initiateIpfs: (state, { payload }: PayloadAction<IpfsState>) => {
			const auth = "Basic " + btoa(payload.projectId + ":" + payload.apiKeySecret);
			return create({
				url: payload.ipfsApiEndpoint,
				headers: {
					Authorization: auth,
				},
			});
		},
	},
});

export const { initiateIpfs } = ipfsSlice.actions;

export default ipfsSlice.reducer;
