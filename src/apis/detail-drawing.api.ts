import axiosHomeLab from "../configs/homelab-server.config";
import { DetailDrawing } from "../interfaces/detail-drawing.interface";

const getById = async (id: string): Promise<DetailDrawing> => {
	return axiosHomeLab.get<string, DetailDrawing>(`detail-drawings/${id}`);
};

const create = async (data: Partial<DetailDrawing>): Promise<Partial<DetailDrawing>> => {
	return axiosHomeLab.post<string, Partial<DetailDrawing>>(`detail-drawings`, data);
};

export { getById, create };
