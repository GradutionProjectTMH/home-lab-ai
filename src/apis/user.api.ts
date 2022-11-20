import axiosClient from "../configs/server.config";
import { ROLE } from "../enums/user.enum";
import { ResponseAllData, User } from "../types/common";
import queryString from "query-string";

interface UserQuery {
	limit?: number;
	page?: number;
	typeUser?: ROLE;
}

export const getAllUser = async (query: UserQuery): Promise<User[]> => {
	console.log(query);

	return axiosClient.get<string, User[]>("user", {
		params: query,
	});
};
