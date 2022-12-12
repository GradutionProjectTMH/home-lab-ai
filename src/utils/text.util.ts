export function joinTxts(...texts: (string | null | undefined)[]): string {
	return texts.filter((text) => text).join(" ");
}

export function formatAddress(address: string): string {
	return `${address.substring(0, 7)}...`;
}

export const formatPrice = (price: number) => {
	return price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const removeDuplicated = (texts: string[]) => {
	return texts.reduce<string[]>((result, text) => {
		if (!result.find((item) => item == text)) result.push(text);

		return result;
	}, []);
};
