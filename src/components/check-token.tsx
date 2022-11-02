import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUserLogin, setIsLogin } from "../redux/slices/user-login.slice";
import * as authApi from "../apis/auth.api";

const CheckToken = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		const callCheckToken = async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) {
				}
				const response = await authApi.checkToken();
				dispatch(addUserLogin(response));
				dispatch(setIsLogin(true));
			} catch (error) {
				console.log(error);

				dispatch(setIsLogin(false));
			}
		};

		callCheckToken();
	}, []);
	return <div></div>;
};

export default CheckToken;
