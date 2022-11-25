export const formatPrice = (price: number) => {
	return price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};
