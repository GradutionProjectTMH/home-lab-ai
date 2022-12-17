import axiosClient from "../configs/server.config";
import { Transaction } from "../interfaces/transaction.interface";

const getAll = async (): Promise<Transaction[]> => {
	return axiosClient.get<string, Transaction[]>(`transaction`);
};

export { getAll };
