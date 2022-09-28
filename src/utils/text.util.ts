export function joinTxts(...texts: (string | null)[]) {
	return texts.filter((text) => text).join(" ");
}
