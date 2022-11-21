import axiosClient from "../configs/server.config";
import { Hire } from "../interfaces/hire.interface";

export const createHire = async (data: Partial<Hire>): Promise<Partial<Hire>> => {
	return axiosClient.post<string, Hire>(`hire`, data);
};

export const updateHire = async (id: string, data: Partial<Hire>): Promise<Partial<Hire>> => {
	return axiosClient.put<string, any>(`hire/${id}`, data);
};
