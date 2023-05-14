type GetProductsReq = {
	name?: string;
	categoryIds?: string[] | string;
	minPrice?: number;
	maxPrice?: number;
	sort?: GetProductSortType;
	style?: GetProductStyle;
	roomType?: GetProductRoomType;
	page?: number;
	limit?: number;
};

type GetProductsRes = {
	data: {
		id: string;
		name: string;
		description: string;
		thumbnailUrl: string;
		thumbnails: string[];
		price: number;
		style: string;
		roomType: string;
		marble: string;
		lightAndDarkStyle: string;
		decorateTheItems: string;
		kindsOfLargeObjects: string;
		additionalInformation: string;
		prompt: string;
		categories: {
			id: string;
			name: string;
		}[];
	}[];
	total: number;
	currentPage: number;
};

type GetCategoriesRes = {
	id: string;
	name: string;
	thumbnailUrl: string;
	prompt: string;
}[];
