import { STATUS_HIRE } from "../enums/hiring.enum";
import { User } from "../types/common";

type ItemDesign = {
	image: string;
	coHomeUrl: string;
	isChoose: boolean;
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
