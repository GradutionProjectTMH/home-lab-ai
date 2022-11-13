import axiosClient from "../configs/server.config";
import { DetailDrawing } from "../interfaces/detail-drawing.interface";

const getById = async (id: string): Promise<DetailDrawing> => {
	return axiosClient.get<DetailDrawing, DetailDrawing>(`detail-drawings/${id}`);
};

const create = async (data: DetailDrawing): Promise<DetailDrawing> => {
	return axiosClient.post<DetailDrawing, DetailDrawing>(`detail-drawings`, data);
};

export { getById, create };
