import { createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import {
	Material_proxy as MaterialAddress,
	HomeLab_proxy as HomeLabAddress,
} from "../../contracts/contract_addresses.json";
import MaterialAbi from "../../contracts/artifacts/Material.json";
import HomeLabAbi from "../../contracts/artifacts/HomeLab.json";
import { Material } from "../../contracts/typechain-types";
import { HomeLab } from "../../contracts/typechain-types";

type EtherState = {
	provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
	contract: {
		Material: Material;
		HomeLab: HomeLab;
	};
};

const defaultProvider = new ethers.providers.JsonRpcProvider();

const etherSlice = createSlice<EtherState, SliceCaseReducers<EtherState>>({
	name: "etherSlice",
	initialState: {
		provider: defaultProvider,
		contract: {
			Material: new ethers.Contract(MaterialAddress, MaterialAbi) as Material,
			HomeLab: new ethers.Contract(HomeLabAddress, HomeLabAbi) as HomeLab,
		},
	},
	reducers: {
		initiateEther: (state, action: PayloadAction<EtherState["provider"]>) => {
			const provider = action.payload;
			const Material = new ethers.Contract(MaterialAddress, MaterialAbi, provider) as Material;
			const HomeLab = new ethers.Contract(HomeLabAddress, HomeLabAbi, provider) as HomeLab;

			(window as any).ethers = ethers;
			(window as any).provider = provider;
			(window as any).Material = Material;
			(window as any).HomeLab = HomeLab;

			return {
				provider,
				contract: {
					Material,
					HomeLab,
				},
			};
		},
	},
});

export const { initiateEther, connectWallet } = etherSlice.actions;

export default etherSlice.reducer;
