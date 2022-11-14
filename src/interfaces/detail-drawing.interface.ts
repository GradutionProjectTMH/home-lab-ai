import { DETAIL_DRAWING } from "../enums/detail-drawing.enum";
import { Hire } from "./hire.interface";

export interface DetailDrawing {
	_id: string;
	houseBoundary: number;
	width: number;
	height: number;
	boundaryImg: string;
	crossSectionImg: string;
	expectedMaterial: [
		{
			name: string;
			amount: number;
		},
	];
	rooms: [
		{
			name: string;
			amount: number;
		},
	];
	hire: Hire;
	status: DETAIL_DRAWING;
}
