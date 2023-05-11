import axiosHomeLab from "../configs/homelab-server.config";
import { Hire } from "../interfaces/hire.interface";
import { ResponseAllData } from "../types/common";

interface QueryHire {
	typeOrder: string;
}

export const getAll = async (query: QueryHire): Promise<ResponseAllData<Hire>> => {
	return axiosHomeLab.get<string, ResponseAllData<Hire>>(`hire`, {
		params: query,
	});
};

export const createHire = async (data: Partial<Hire>): Promise<Partial<Hire>> => {
	return axiosHomeLab.post<string, Hire>(`hire`, data);
};

export const updateHire = async (id: string, data: Partial<Hire>): Promise<Partial<Hire>> => {
	return axiosHomeLab.put<string, any>(`hire/${id}`, data);
};
