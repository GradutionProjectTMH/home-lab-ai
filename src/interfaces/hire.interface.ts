import { STATUS_HIRE } from "../enums/hiring.enum";
import { User } from "../types/common";

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
	_id?: string;
	userId?: string;
	designerId?: string;
	designer?: User;
	detailDrawing?: string;
	detailDrawingId?: string;
	floorDesigns?: FloorDesign[];
	houseDesigns?: ItemDesign[];
	status: STATUS_HIRE;
}
