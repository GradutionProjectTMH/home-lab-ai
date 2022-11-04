import axiosClient from "../configs/axios.config";
import { IAuthLogin } from "../interfaces/auth.interface";
import { IResponseWithData } from "../interfaces/response.interface";
import { IUser } from "../interfaces/user.interface";
import { baseApi } from "./base.api";

const loginByGoogle = async (token: string): Promise<IAuthLogin> => {
	const response = await axiosClient.post<IResponseWithData<IAuthLogin>>("auth/login-by-google", {
		token,
	});

	return baseApi<IAuthLogin>(response);
};

const checkToken = async (): Promise<IUser> => {
	const response = await axiosClient.get<IResponseWithData<IUser>>("auth/check-token", {});
	return baseApi<IUser>(response);
};

export { loginByGoogle, checkToken };
