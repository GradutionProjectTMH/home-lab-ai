export function joinTxts(...texts: (string | null)[]): string {
	return texts.filter((text) => text).join(" ");
}

export function formatAddress(address: string): string {
	return `${address.substring(0, 7)}...`;
}
