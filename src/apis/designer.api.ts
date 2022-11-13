import axiosClient from "../configs/server.config";
import { Designer } from "../interfaces/designer.interface";
import { ResponseAllData } from "../types/common";

const getAll = async (): Promise<ResponseAllData<Designer>> => {
	return axiosClient.get<ResponseAllData<Designer>, ResponseAllData<Designer>>(`designer`);
};

const getById = async (id: string): Promise<Designer> => {
	return axiosClient.get<Designer, Designer>(`designer/${id}`);
};

const create = async (data: Designer): Promise<Designer> => {
	return axiosClient.post<Designer, Designer>(`designer`, data);
};

export { getAll, getById, create };
