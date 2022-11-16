import axiosClient from "../configs/server.config";
import { Hire } from "../interfaces/hire.interface";

export const createHire = async (data: Hire): Promise<Hire> => {
	return axiosClient.post<Hire, Hire>(`hire`, data);
};

export const updateHire = async (id: string, data: Hire): Promise<Hire> => {
	return axiosClient.put<Hire, any>(`hire/${id}`, data);
};
