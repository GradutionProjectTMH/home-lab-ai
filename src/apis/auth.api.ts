import axiosClient from "../configs/server.config";
import { User, UserLogin } from "../types/common";

export const loginByGoogle = async (token: string): Promise<UserLogin> =>
	axiosClient.post<UserLogin, UserLogin>("auth/login-by-google", { token });

export const checkToken = async (): Promise<User> => axiosClient.get<User, User>("auth/check-token");
