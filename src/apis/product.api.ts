import axiosClient from "../configs/server.config";
import { Products } from "../interfaces/product.interface";

const getById = async (id: string): Promise<Products> => {
	return axiosClient.get<Products, Products>(`products/${id}`);
};

const create = async (data: Products): Promise<Products> => {
	return axiosClient.post<Products, Products>(`products`, data);
};

export { getById, create };
