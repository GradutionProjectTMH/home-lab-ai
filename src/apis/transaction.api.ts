import axiosClient from "../configs/server.config";
import { Transaction } from "../interfaces/transaction.interface";
import { ResponseAllData } from "../types/common";

export const getAll = async (): Promise<ResponseAllData<Transaction>> => {
	return axiosClient.get<string, ResponseAllData<Transaction>>(`transaction`);
};

export const createTransaction = async (data: Partial<Transaction>): Promise<Partial<Transaction>> => {
	return axiosClient.post<string, Transaction>(`transaction`, data);
};
