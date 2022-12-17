export interface Transaction {
	_id: string;
	userId: string;
	from: string;
	to: string;
	method: string;
	hash: string;
}
