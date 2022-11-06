import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as authApi from "../apis/auth.api";
import { updateUser } from "../redux/slices/user.slice";
import { User } from "../types/common";

const Initializer = () => {
	const dispatch = useDispatch();

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

	useEffect(() => {
		setupEnvironment();
		checkAuthentication();
	}, []);
	return <div></div>;
};

export default Initializer;
