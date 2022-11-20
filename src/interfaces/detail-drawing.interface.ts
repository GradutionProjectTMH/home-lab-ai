import { DETAIL_DRAWING, ROOM_TYPE } from "../enums/detail-drawing.enum";
import { Hire } from "./hire.interface";

interface BountyReward {
	coinId: string;
	amount: number;
}
interface AdditionalInformation {
	budget: string;
	members: string;
	theme: string;
	location: string;
	locatedAtAlley: boolean;
	businessInHouse: boolean;
	inTheCorner: boolean;
}

interface Room {
	name: ROOM_TYPE;
	amount: number;
}
export interface DetailDrawing {
	_id: string;
	houseBoundary: number;
	width: number;
	height: number;
	boundaryImg: string;
	crossSectionImg: string;
	numberOfFloors: number;
	heightOfEachFloors: number;
	themeColor: string;
	expectedMaterial: [
		{
			name: string;
			amount: number;
		},
	];
	rooms?: Room[];
	hire: Hire;
	bountyRewards: BountyReward[];
	additionalInformation: Partial<AdditionalInformation>;
	status: DETAIL_DRAWING;
}
