import React, { useEffect, useState } from "react";
import Stack from "../components/layout/stack";
import { Transaction } from "../interfaces/transaction.interface";
import * as transactionApi from "../apis/transaction.api";
import { formatAddress } from "../utils/text.util";

const HistoryTransaction = () => {
	const [transactions, setTransaction] = useState<Transaction[]>([]);
	const fetchTransaction = async () => {
		try {
			const result = await transactionApi.getAll();
			setTransaction(result);
		} catch (error) {
			throw error;
		}
	};

	const handleRowClicked = (hash: string) => {
		window.location.href = `https://testnet.bscscan.com/tx/${hash}`;
	};

	useEffect(() => {
		fetchTransaction();
	}, []);

	return (
		<Stack className="w-full h-full">
			<table className="table-auto font-body flex-grow">
				<thead className="bg-gray-200 text-gray-900">
					<tr>
						<th className="border border-r-0 border-l-0 px-0 text-left border-gray-300">Hash</th>
						<th className="border border-r-0 border-l-0 px-0 text-left border-gray-300">From</th>
						<th className="border border-r-0 border-l-0 px-0 text-left border-gray-300">To</th>
						<th className="border border-r-0 border-l-0 px-0 text-left border-gray-300">Method</th>
					</tr>
				</thead>
				<tbody>
					{transactions.map((transaction, index) => (
						<tr
							className="cursor-pointer hover:bg-gray-50"
							key={index}
							onClick={() => handleRowClicked(transaction.hash)}
						>
							<td className="border border-r-0 border-l-0 px-0 border-gray-300">{formatAddress(transaction.hash)}</td>
							<td className="border border-r-0 border-l-0 px-0 border-gray-300">{transaction.from}</td>
							<td className="border border-r-0 border-l-0 px-0 border-gray-300">{transaction.to}</td>
							<td className="border border-r-0 border-l-0 px-0 border-gray-300">{transaction.method}</td>
						</tr>
					))}
				</tbody>
			</table>
		</Stack>
	);
};

export default HistoryTransaction;
