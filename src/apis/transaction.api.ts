import axiosClient from "../configs/server.config";
import { Transaction } from "../interfaces/transaction.interface";

export const getAll = async (): Promise<Transaction[]> => {
	return axiosClient.get<string, Transaction[]>(`transaction`);
};

export const createTransaction = async (data: Partial<Transaction>): Promise<Partial<Transaction>> => {
	return axiosClient.post<string, Transaction>(`transaction`, data);
};
