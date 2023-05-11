import axiosClient from "../configs/server.config";
import { Product } from "../interfaces/product.interface";

export const getProductById = async (id: string): Promise<Product> => {
	return axiosClient.get<Product, Product>(`products/${id}`);
};

export const createProduct = async (data: Partial<Product>): Promise<Partial<Product>> => {
	return axiosClient.post<Partial<Product>, Partial<Product>>(`products`, data);
};
