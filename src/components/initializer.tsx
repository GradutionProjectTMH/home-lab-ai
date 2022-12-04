import { ethers } from "ethers";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Ether from "../apis/ether.api";
import * as authApi from "../apis/server/auth.api";
import { getEnvironment } from "../apis/server/environment.api";
import { setEnvironment } from "../redux/slices/environment.slice";
import { setWalletAddress, initiateEther } from "../redux/slices/ether.slice";
import { initiateFirebase } from "../redux/slices/firebase-service.slice";
import { initiateG2p } from "../redux/slices/g2p-service.slice";
import { initiateIpfs } from "../redux/slices/ipfs.slice";
import { pushInfo } from "../redux/slices/message.slice";
import { initiateTextRazor } from "../redux/slices/textrazor-service.slice";
import { updateUser } from "../redux/slices/user.slice";
import { RootState } from "../redux/stores/store.redux";
import { User } from "../types/common";

const Initializer = () => {
	const dispatch = useDispatch();
	const environment = useSelector((state: RootState) => state.environment);

	// ---------------Setup Environment---------------

	const setupEnvironment = async () => {
		try {
			const environment = await getEnvironment();
			dispatch(setEnvironment(environment));
		} catch (error) {
			dispatch(updateUser(null));
			throw error;
		}
	};

	useEffect(() => {
		setupEnvironment();
	}, []);

	// ---------------Setup Services---------------

	const setupServices = async () => {
		const etherProvider = new ethers.providers.Web3Provider((window as any).ethereum);
		dispatch(initiateEther(etherProvider));
		const signer = etherProvider.getSigner();
		try {
			const walletAddress = await signer.getAddress();
			dispatch(setWalletAddress(walletAddress));
		} catch (error) {
			console.error(error);
			dispatch(pushInfo("Tip: Connect Metamask wallet to access more features"));
		}

		const firebaseConfig = environment.firebase;
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

		const g2pConfig = environment.g2p;
		dispatch(initiateG2p({ baseUrl: g2pConfig.API_ENDPOINT }));

		const textRazorConfig = environment.textRazor;
		dispatch(
			initiateTextRazor({
				endPoint: textRazorConfig.API_ENDPOINT,
				apiKey: textRazorConfig.API_KEY,
			}),
		);

		const ipfsConfig = environment.infura;
		dispatch(
			initiateIpfs({
				projectId: ipfsConfig.PROJECT_ID,
				apiKeySecret: ipfsConfig.API_KEY_SECRET,
				ipfsApiEndpoint: ipfsConfig.IPFS_API_ENDPOINT,
				dedicatedGatewayDomain: ipfsConfig.DEDICATED_GATEWAY_SUBDOMAIN,
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
		if (environment.isReady) initialize();
	}, [environment]);

	// ---------------Setup Events---------------

	const setupMetamaskEvents = () => {
		const ethereum = (window as any).ethereum;

		const handleConnected = (connectInfo: any) => {
			console.log(connectInfo);
		};
		ethereum.on("connect", handleConnected);

		const handleDisconnected = (error: any) => {
			console.error(error);
			dispatch(setWalletAddress(undefined));
		};
		ethereum.on("disconnect", handleDisconnected);

		const handleAccountsChanged = (accounts: string[]) => dispatch(setWalletAddress(accounts.shift()));
		ethereum.on("accountsChanged", handleAccountsChanged);

		const handleChainChanged = (chainId: number) => window.location.reload();
		ethereum.on("chainChanged", handleChainChanged);

		const handleMessaged = ({ type, data }: { type: string; data: unknown }) => dispatch(pushInfo(`${type}: ${data}`));
		ethereum.on("message", handleMessaged);

		return () => {
			ethereum.removeListener("connect", handleConnected);
			ethereum.removeListener("disconnect", handleDisconnected);
			ethereum.removeListener("accountsChanged", handleAccountsChanged);
			ethereum.removeListener("handleChainChangedd", handleChainChanged);
			ethereum.removeListener("handleMessaged", handleMessaged);
		};
	};

	useEffect(() => {
		// if (environment.isReady) {
		// 	const handleListenersRemoved = setupMetamaskEvents();
		// 	return () => handleListenersRemoved();
		// }
	}, [environment]);

	return <div></div>;
};

export default Initializer;
