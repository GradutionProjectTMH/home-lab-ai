import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as authApi from "../apis/server/auth.api";
import { initiateFirebase } from "../redux/slices/firebase-service.slice";
import { updateUser } from "../redux/slices/user.slice";
import { RootState } from "../redux/stores/store.redux";
import { User } from "../types/common";

const Initializer = () => {
	const dispatch = useDispatch();
	const environment = useSelector((state: RootState) => state.environment);

	const checkAuthentication = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) return;

			const user: User = await authApi.checkToken();
			dispatch(updateUser(user));
		} catch (error) {
			dispatch(updateUser(null));
			throw error;
		}
	};

	const setupEnvironment = async () => {
		try {
			const user: User = await authApi.checkToken();
			dispatch(updateUser(user));
		} catch (error) {
			dispatch(updateUser(null));
			throw error;
		}
	};

	const setupFirebaseService = () => {
		const env = environment.firebase;
		dispatch(
			initiateFirebase({
				apiKey: env.API_KEY,
				authDomain: env.AUTH_DOMAIN,
				projectId: env.PROJECT_ID,
				storageBucket: env.STORAGE_BUCKET,
				messagingSenderId: env.MESSAGING_SENDER_ID,
				appId: env.APP_ID,
				measurementId: env.MEASUREMENT_ID,
			}),
		);
	};

	const initializer = async () => {
		await setupEnvironment();
		await checkAuthentication();

		setupFirebaseService();

		console.log("Done");
	};

	useEffect(() => {
		initializer();
	}, []);
	return <div></div>;
};

export default Initializer;
