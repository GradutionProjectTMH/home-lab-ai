import axiosHomeLab from "../configs/homelab-server.config";
import { Transaction } from "../interfaces/transaction.interface";

export const getAll = async (): Promise<Transaction[]> => {
	return axiosHomeLab.get<string, Transaction[]>(`transaction`);
};

export const createTransaction = async (data: Partial<Transaction>): Promise<Partial<Transaction>> => {
	return axiosHomeLab.post<string, Transaction>(`transaction`, data);
};
