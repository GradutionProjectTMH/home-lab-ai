import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as authApi from "../apis/server/auth.api";
import { firebaseConfig, g2pConfig, infuraConfig, tfFloorPlanConfig } from "../configs/environment";
import { initiateFirebase } from "../redux/slices/firebase-service.slice";
import { initiateG2p } from "../redux/slices/g2p-service.slice";
import { initiateIpfs } from "../redux/slices/ipfs.slice";
import { initiateTFFloorPlan } from "../redux/slices/tf-floor-plan-service.slice";
import { updateUser } from "../redux/slices/user.slice";
import { User } from "../types/common";

const Initializer = () => {
	const dispatch = useDispatch();
	// ---------------Setup Services---------------

	const setupServices = async () => {
		// const etherProvider = new ethers.providers.Web3Provider((window as any).ethereum);
		// dispatch(initiateEther(etherProvider));
		// const signer = etherProvider.getSigner();
		// try {
		// 	const walletAddress = await signer.getAddress();
		// 	dispatch(setWalletAddress(walletAddress));
		// } catch (error) {
		// 	console.error(error);
		// 	dispatch(pushInfo("Tip: Connect Metamask wallet to access more features"));
		// }

		dispatch(
			initiateFirebase({
				apiKey: firebaseConfig.API_KEY,
				authDomain: firebaseConfig.AUTH_DOMAIN,
				projectId: firebaseConfig.PROJECT_ID,
				storageBucket: firebaseConfig.STORAGE_BUCKET,
				messagingSenderId: firebaseConfig.MESSAGING_SENDER_ID,
				appId: firebaseConfig.APP_ID,
				measurementId: firebaseConfig.MEASUREMENT_ID,
			}),
		);

		console.log(g2pConfig.API_ENDPOINT);

		dispatch(initiateTFFloorPlan({ baseUrl: tfFloorPlanConfig.API_ENDPOINT }));

		dispatch(initiateG2p({ baseUrl: g2pConfig.API_ENDPOINT }));

		dispatch(
			initiateIpfs({
				projectId: infuraConfig.PROJECT_ID,
				apiKeySecret: infuraConfig.API_KEY_SECRET,
				ipfsApiEndpoint: infuraConfig.IPFS_API_ENDPOINT,
				dedicatedGatewayDomain: infuraConfig.DEDICATED_GATEWAY_SUBDOMAIN,
			}),
		);
	};

	const checkAuthentication = async () => {
		try {
			const token = window?.localStorage.getItem("token");
			if (!token) return;

			const user: User = await authApi.checkToken();
			dispatch(updateUser(user));
		} catch (error) {
			dispatch(updateUser(null));
			throw error;
		}
	};

	const initialize = async () => {
		await setupServices();
		await checkAuthentication();
	};

	useEffect(() => {
		initialize();
	}, []);

	// ---------------Setup Events---------------

	// const setupMetamaskEvents = () => {
	// 	const ethereum = (window as any).ethereum;

	// 	const handleConnected = (connectInfo: any) => {
	// 		console.log(connectInfo);
	// 	};
	// 	ethereum.on("connect", handleConnected);

	// 	const handleDisconnected = (error: any) => {
	// 		console.error(error);
	// 		dispatch(setWalletAddress(undefined));
	// 	};
	// 	ethereum.on("disconnect", handleDisconnected);

	// 	const handleAccountsChanged = async (accounts: string[]) => {
	// 		const account = accounts.shift();
	// 		await updateUserProfile({ wallet: account });
	// 		dispatch(setWalletAddress(account));
	// 	};
	// 	ethereum.on("accountsChanged", handleAccountsChanged);

	// 	const handleChainChanged = (chainId: number) => window.location.reload();
	// 	ethereum.on("chainChanged", handleChainChanged);

	// 	const handleMessaged = ({ type, data }: { type: string; data: unknown }) => dispatch(pushInfo(`${type}: ${data}`));
	// 	ethereum.on("message", handleMessaged);

	// 	return () => {
	// 		ethereum.removeListener("connect", handleConnected);
	// 		ethereum.removeListener("disconnect", handleDisconnected);
	// 		ethereum.removeListener("accountsChanged", handleAccountsChanged);
	// 		ethereum.removeListener("handleChainChangedd", handleChainChanged);
	// 		ethereum.removeListener("handleMessaged", handleMessaged);
	// 	};
	// };

	// useEffect(() => {
	// 	if (environment.isReady) {
	// 		const handleListenersRemoved = setupMetamaskEvents();
	// 		return () => handleListenersRemoved();
	// 	}
	// }, [environment]);

	return <div></div>;
};

export default Initializer;
