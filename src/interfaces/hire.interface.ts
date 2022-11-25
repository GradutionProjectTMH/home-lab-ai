import { STATUS_HIRE } from "../enums/hiring.enum";
import { User } from "../types/common";
import { Products } from "./product.interface";

export type Material = {
	amount?: number;
} & Products;

type ItemDesign = {
	image: string;
	coHomeUrl: string;
	isChoose: boolean;
	materials?: Material[];
};

export type FloorDesign = {
	floor: number;
	designs: ItemDesign[];
	status: boolean;
};

export type HouseDesign = {
	designs: ItemDesign[];
	status: boolean;
};
export interface Hire {
	_id: string;
	userId?: string;
	designerId?: string;
	designer?: User;
	detailDrawing?: string;
	detailDrawingId?: string;
	floorDesigns?: FloorDesign[];
	houseDesigns?: HouseDesign[];
	status: STATUS_HIRE;
}
