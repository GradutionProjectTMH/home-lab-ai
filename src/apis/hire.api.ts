import axiosClient from "../configs/server.config";
import { Hire } from "../interfaces/hire.interface";
import { ResponseAllData } from "../types/common";

interface QueryHire {
	typeOrder: string;
}

export const getAll = async (query: QueryHire): Promise<ResponseAllData<Hire>> => {
	return axiosClient.get<string, ResponseAllData<Hire>>(`hire`, {
		params: query,
	});
};

export const createHire = async (data: Partial<Hire>): Promise<Partial<Hire>> => {
	return axiosClient.post<string, Hire>(`hire`, data);
};

export const updateHire = async (id: string, data: Partial<Hire>): Promise<Partial<Hire>> => {
	return axiosClient.put<string, any>(`hire/${id}`, data);
};
