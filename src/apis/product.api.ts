import axiosHomeLab from "../configs/homelab-server.config";
import { Product } from "../interfaces/product.interface";

export const getProductById = async (id: string): Promise<Product> => {
	return axiosHomeLab.get<Product, Product>(`products/${id}`);
};

export const createProduct = async (data: Partial<Product>): Promise<Partial<Product>> => {
	return axiosHomeLab.post<Partial<Product>, Partial<Product>>(`products`, data);
};
