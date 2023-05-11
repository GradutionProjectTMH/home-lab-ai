import axiosHomeLab from "../../configs/homelab-server.config";
import { User, UserLogin } from "../../types/common";

export const loginByGoogle = async (token: string): Promise<UserLogin> =>
	axiosHomeLab.post<UserLogin, UserLogin>("auth/login-by-google", { token });

export const checkToken = async (): Promise<User> => axiosHomeLab.get<User, User>("auth/check-token");
