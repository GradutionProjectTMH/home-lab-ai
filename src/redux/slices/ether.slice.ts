import { createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import contractAddresses from "../../contracts/contract_addresses.json";
import MaterialAbi from "../../contracts/artifacts/Material.json";
import HomeLabAbi from "../../contracts/artifacts/HomeLab.json";
import { Material } from "../../contracts/typechain-types";
import { HomeLab } from "../../contracts/typechain-types";

const MaterialAddress = contractAddresses.Material_proxy;
const HomeLabAddress = contractAddresses.HomeLab_proxy;

type EtherState = {
	provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
	walletAddress?: string;
	contract: {
		Material: Material;
		HomeLab: HomeLab;
	};
};

const etherSlice = createSlice<EtherState | null, SliceCaseReducers<EtherState | null>>({
	name: "etherSlice",
	initialState: null,
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
				isReady: true,
				provider,
				contract: {
					Material,
					HomeLab,
				},
			};
		},
		setWalletAddress: (state, action: PayloadAction<string>) => {
			state!.walletAddress = action.payload;
		},
	},
});

export const { initiateEther, setWalletAddress } = etherSlice.actions;

export default etherSlice.reducer;
