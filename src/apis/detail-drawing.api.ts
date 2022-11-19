import axiosClient from "../configs/server.config";
import { DetailDrawing } from "../interfaces/detail-drawing.interface";

const getById = async (id: string): Promise<DetailDrawing> => {
	return axiosClient.get<string, DetailDrawing>(`detail-drawings/${id}`);
};

const create = async (data: Partial<DetailDrawing>): Promise<Partial<DetailDrawing>> => {
	return axiosClient.post<string, Partial<DetailDrawing>>(`detail-drawings`, data);
};

export { getById, create };
