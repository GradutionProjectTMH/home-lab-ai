// import { Block, TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";
// import { BigNumber as BN } from "ethers";
// import { store } from "../redux/stores/store.redux";

// const isConnected = () => (window as any).ethereum.isConnected();

// async function getBlock(): Promise<Block> {
// 	const { provider } = store.getState().ether!;
// 	const latestBlock = await provider.getBlock("latest");
// 	return latestBlock;
// }

// async function getTimestamp(): Promise<number> {
// 	const latestBlock = await getBlock();
// 	return latestBlock.timestamp;
// }

// async function getBlockNumber(): Promise<number> {
// 	const latestBlock = await getBlock();
// 	return latestBlock.number;
// }

// export const parseError = (error: any) => {
// 	if (error.reason?.includes("unapproved collaborators left"))
// 		return "All collaborators deliverables must be approved before finishing worktask";

// 	if (error.reason?.includes("not enough package budget left"))
// 		return "The worktask's remaining budget is insufficient";

// 	if (error.reason?.includes("caller is not the project initiator"))
// 		return "Please connect to the correct wallet of project initiator";

// 	if (error.reason?.includes("unknown account #0")) return "Please connect to wallet";

// 	if (error.reason?.includes("low-level call failed")) return "Not enough token";

// 	if (error.reason) return error.reason?.replace("execution reverted:", "");

// 	if (error.data) return error.data.message?.replace("err:", "");
// };

// const Ether = {
// 	isConnected,
// 	getBlock,
// 	getTimestamp,
// 	getBlockNumber,
// 	parseError,
// 	BN,
// };

// export default Ether;

export default "TODO: Not implemented yet";
