import axiosHomeLab from "../configs/homelab-server.config";
import { ROLE } from "../enums/user.enum";
import { ResponseAllData, User } from "../types/common";
import queryString from "query-string";

interface UserQuery {
	limit?: number;
	page?: number;
	typeUser?: ROLE;
}

export const getAllUser = async (query: UserQuery): Promise<ResponseAllData<User>> => {
	return axiosHomeLab.get<string, ResponseAllData<User>>("user", {
		params: query,
	});
};

export const updateUserProfile = async (data: Partial<User>): Promise<Partial<User>> => {
	return axiosHomeLab.put<string, any>(`user/profile`, data);
};
