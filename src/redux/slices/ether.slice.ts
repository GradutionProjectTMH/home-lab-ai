import { createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import {
	Material_proxy as MaterialAddress,
	HomeLab_proxy as HomeLabAddress,
} from "../../contracts/contract_addresses.json";
import { abi as MaterialAbi } from "../../contracts/artifacts/Material.json";
import { abi as HomeLabAbi } from "../../contracts/artifacts/HomeLab.json";
import { Material } from "../../contracts/typechain-types";
import { HomeLab } from "../../contracts/typechain-types";

type EtherState = {
	provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
	contract: {
		Material: Material;
		HomeLab: HomeLab;
	};
};

const etherSlice = createSlice<EtherState, SliceCaseReducers<EtherState>>({
	name: "etherSlice",
	initialState: {
		provider: new ethers.providers.JsonRpcProvider(),
		contract: {
			Material: new ethers.Contract(MaterialAddress, MaterialAbi) as Material,
			HomeLab: new ethers.Contract(HomeLabAddress, HomeLabAbi) as HomeLab,
		},
	},
	reducers: {
		initiateEther: (state, action: PayloadAction<EtherState["provider"]>) => {
			const provider = action.payload;
			return {
				provider,
				contract: {
					Material: new ethers.Contract(MaterialAddress, MaterialAbi, provider) as Material,
					HomeLab: new ethers.Contract(HomeLabAddress, HomeLabAbi, provider) as HomeLab,
				},
			};
		},
	},
});

export const { initiateEther } = etherSlice.actions;

export default etherSlice.reducer;
