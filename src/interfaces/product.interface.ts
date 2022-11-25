import { PRODUCT_STATUS, TYPE_PRODUCT } from "../enums/product.enum";

interface VerifyProduct {
	name: string;
	data: string;
	owner: string;
	paymentToken: string;
	bounty: number;
	verifyBy: string;
	verifiedAt: Date;
}

export interface Products {
	_id: string;
	name: string;
	images: string[];
	star: number;
	oldPrice: number;
	price: number;
	sale: number;
	comment: number;
	order: number;
	description: string;
	type: TYPE_PRODUCT;
	status: PRODUCT_STATUS;
	verify?: any;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
}
