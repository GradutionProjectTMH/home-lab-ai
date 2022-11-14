import { STATUS_HIRE } from "../enums/hiring.enum";
import { Designer } from "./designer.interface";

type ItemDesign = {
	image: string;
	coHomeUrl: string;
	isChoose: boolean;
};

type FloorDesign = {
	image: string;
	coHomeUrl: string;
	isChoose: boolean;
};

export interface Hire {
	userId?: string;
	designerId?: string;
	designer?: Designer;
	detailDrawing?: string;
	detailDrawingId?: string;
	floorDesigns?: FloorDesign[];
	houseDesigns?: ItemDesign[];
	status?: STATUS_HIRE;
}
