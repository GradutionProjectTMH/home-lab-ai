type IdeaPosition = {
	index: number;
	roomLabel: string;
	x: number;
	y: number;
};

type Boundary = {
	door: [number, number, number, number];
	exteriors: [number, number][];
};

type SuggestedPlan = {
	trainName: string;
	url: string;
};
