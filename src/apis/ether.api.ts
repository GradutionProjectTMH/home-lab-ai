import { Block, TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";
import { BigNumber as BN } from "ethers";
import { store } from "../redux/stores/store.redux";

const isConnected = () => (window as any).ethereum.isConnected();

async function getBlock(): Promise<Block> {
	const { provider } = store.getState().ether!;
	const latestBlock = await provider.getBlock("latest");
	return latestBlock;
}

async function getTimestamp(): Promise<number> {
	const latestBlock = await getBlock();
	return latestBlock.timestamp;
}

async function getBlockNumber(): Promise<number> {
	const latestBlock = await getBlock();
	return latestBlock.number;
}

const Ether = {
	isConnected,
	getBlock,
	getTimestamp,
	getBlockNumber,
	BN,
};

export default Ether;
